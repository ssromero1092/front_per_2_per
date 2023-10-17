import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiChatService } from 'src/app/utils/service/per2per/api.chat.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  STORAGELOGIN = environment.STORAGELOGIN;

  constructor(
    private routes: Router,
    private apiChat: ApiChatService,
    private router: Router
  ) {
  }
  // Elemento de la interfaz de usuario que se referencia al contenedor de mensajes.
  @ViewChild('mesnajeContenedor') private mesnajeContenedor!: ElementRef;

  // Arreglo para almacenar mensajes en el chat
  messages: {
    text: string;
    user: string;
  }[] = [];

  // Variable para almacenar el mensaje ingresado por el usuario o por el boot
  mensajeNuevo: string = '';
  mensajeNuevoValor: number = 0;

  // Mensaje inicial del chat
  mensagePideMoneda: string = '';

  // variable que guarda el tipo de moneda
  mensageTipoModena: string = '';


  // Variable para controlar el estado del chat (esperando tipo de cambio == 1  o monto ==2)
  marcaMomentoChat: number = 0;

  // Variable Usuario
  usuario: any;

// Variable para controlar el log
mostrarPopup: boolean = false;
logData: any = [];

// Función para abrir el log
abrirPopup() {
  if (this.mostrarPopup == true) {
    this.mostrarPopup = false
  }else{
    Promise.all([
      this.apiChat.getChat().toPromise(),
    ]).then((res:any) => {
      this.logData = res[0].estado == 200 ? res[0].data : [];
      this.mostrarPopup = true;
    })
  }
}
// Función para cerrar el log
cerrarPopup() {
  this.mostrarPopup = false;
}
  ngOnInit(): void {
    // Recupera el usuario de el almacenamiento local
    this.usuario = localStorage.getItem(this.STORAGELOGIN);
    if (!this.usuario) {
      this.routes.navigate(['/login']);
    };
    this.mensagePideMoneda = `
                                Hola ${this.usuario},
                                Espero que tengas un excelente día,
                                si quieres convertir dinero de Pesos
                                Colombianos (COP) a Dólar (USD) escribe
                                USD; de lo contrario, escribe COP.
                              `;
    // Agregar mensaje al chat
    this.messages.push(
      {
        text: this.mensagePideMoneda,
        user: 'boot'
      }
    );
    this.limpiaFocus();
    this.marcaMomentoChat = 1;
  }
  salir(){
    this.router.navigate(['/login']);
  }
  // Esta función maneja el envío de mensajes en el chat y realiza varias acciones en función del contenido del mensaje.
  enviarMensaje() {
    if (this.mostrarPopup == true) {
      this.mostrarPopup = false
    }
    // Comprobar si el mensaje no está vacío
    if (this.mensajeNuevo) {
      // Primer momento del chat
      if (this.marcaMomentoChat === 1) {
        // Agregar el mensaje del usuario al array de mensajes
        this.messages.push(
          {
            text: this.mensajeNuevo,
            user: 'user'
          }
        );
        // Convertir el mensaje a mayúsculas
        const mensajeMayusculas = this.mensajeNuevo.toUpperCase();
        // Guardar el tipo moneda
        this.mensageTipoModena = mensajeMayusculas;
        // Evaluar el mensaje en mayúsculas
        switch (mensajeMayusculas) {
          case 'COP':
            // Agregar mensaje de solicitud de monto en COP
            this.messages.push(
              {
                text: 'Ingrese el Monto en COP a Convertir a USD',
                user: 'boot'
              }
            );
            this.marcaMomentoChat = 2;
            break;
          case 'USD':
            // Agregar mensaje de solicitud de monto en USD
            this.messages.push(
              {
                text: 'Ingrese el Monto en USD a Convertir a COP',
                user: 'boot'
              }
            );
            this.marcaMomentoChat = 2;
            break;
          default:
            // Mensaje no válido
            this.messages.push(
              {
                text: 'Mensaje no válido',
                user: 'boot'
              }
            );
            break;
        };
        // Limpiar el campo de texto y pone el foco  para un nuevo mensaje
        this.limpiaFocus();
      }
      // Segundo momento del chat
      else if (this.marcaMomentoChat === 2) {
        // convritr el mensaje en un valor numérico
        this.mensajeNuevoValor = parseInt(this.mensajeNuevo);
        // Comprobar si el valor es numérico
        if (!isNaN(this.mensajeNuevoValor)) {
          // Variables para la conversión
          let conversion: any;
          this.messages.push(
            {
              text: this.formatoMoneda(this.mensajeNuevoValor, this.mensageTipoModena, true),
              user: 'user'
            }
          );
          // Llamar al servicio de conversión del valor
          this.apiChat.postChat(this.usuario, Number(this.mensajeNuevoValor), this.mensageTipoModena)
            .subscribe((res: any) => {
              const chat = res['status'] === 200 ? res['body']['data'] : [];
              // Realizar la conversión en función del tipo de moneda
              if (this.mensageTipoModena == 'USD') {
                conversion = Number(chat.quotes.USDCOP) * Number(this.mensajeNuevoValor);
              } else {
                conversion = Number(chat.quotes.COPUSD) * Number(this.mensajeNuevoValor);
              }
              // Agregar el mensaje de respuesta al usuario
              this.messages.push(
                {
                  text: this.formatoMoneda(conversion, this.mensageTipoModena, false),
                  user: 'boot'
                }
              );
              // Agregar mensaje de solicitud de moneda inicial
              this.messages.push(
                {
                  text: this.mensagePideMoneda,
                  user: 'boot'
                }
              );
              // Retornar al primer momento del chat
              this.marcaMomentoChat = 1;
              // Limpiar el foco del campo de entrada del mensaje
              this.limpiaFocus();
            });
        } else {
          // Mensaje no válido
          this.messages.push(
            {
              text: 'Mensaje no válido',
              user: 'boot'
            }
          );
        }
      }
      // Limpiar el campo de entrada del mensaje
      this.mensajeNuevo = '';
    }
  }
  // Funcion para desplazar el contenedor de mensajes hacia abajo
  desplazarContenedorDeMensajesAbajo() {
    if (this.mesnajeContenedor && this.mesnajeContenedor.nativeElement) {
      const elemnto = this.mesnajeContenedor.nativeElement;
      elemnto.scrollTop = elemnto.scrollHeight;
    }
  }
  // funcion para ponerl el focus al input del chat
  limpiaFocus() {
    const elemntoInput = document.querySelector('input[name="esc_mensaje"]') as HTMLInputElement;
    if (elemntoInput) {
      elemntoInput.focus();
    }
    setTimeout(() => {
      this.desplazarContenedorDeMensajesAbajo();
    });
  }
  //funcion para dar formato a los valores numericos en el chat segun su moneda
  formatoMoneda(valor: number, tipoMoneda: string, tipoRespuesta: boolean): string {
    let moneda = '';
    let formato = '';
    let digitos = 0;
    if (tipoRespuesta) {
      moneda = tipoMoneda;
    } else {
      moneda = tipoMoneda === 'USD' ? 'COP' : 'USD';
    }
    if (moneda === 'COP') {
      formato = 'es-CO';
      digitos = 0;
    } else {
      formato = 'en-US';
      digitos = 2;
    }
    const valorFormateado = new Intl.NumberFormat(formato, {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: digitos,
    }).format(valor);
    return `${moneda} ${valorFormateado}`;
  }
}
