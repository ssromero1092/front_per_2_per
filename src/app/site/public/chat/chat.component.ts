import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
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
  ) {
  }
  // Elemento de la interfaz de usuario que se referencia al contenedor de mensajes.
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  // Arreglo para almacenar mensajes en el chat
  messages: { text: string, user: string }[] = [];

  // Variable para almacenar el mensaje ingresado por el usuario o por el boot
  mensajeNuevo: any = '';

  // Mensaje inicial del chat
  mensagePideMoneda = 'Espero que tengas un excelente día, si quieres convertir dinero de Pesos Colombianos (COP) a Dólar (USD) escribe USD; de lo contrario, escribe COP.';


  // Variable para controlar el estado del chat (esperando tipo de cambio == 1  o monto ==2)
  marcaMomentoChat: number = 0;


  ngOnInit(): void {
    const usuario = localStorage.getItem(this.STORAGELOGIN);

    if (!usuario) {
      this.routes.navigate(['/login'])
    }
    console.log(usuario);

    this.messages.push({ text: this.mensagePideMoneda, user: 'boot' })
    this.marcaMomentoChat = 1

  }

  // Método para enviar un mensaje en el chat
  sendMessage() {
    if (this.mensajeNuevo) {

      if (this.marcaMomentoChat === 1) {
        this.messages.push({ text: this.mensajeNuevo, user: 'user' });
        const mensajeMayusculas = this.mensajeNuevo.toUpperCase();
        console.log('mensajeMayusculas', mensajeMayusculas);

        switch (mensajeMayusculas) {
          case 'COP':
            this.messages.push({ text: 'Ingrese el Monto en COP a Convertir a USD', user: 'boot' });
            this.marcaMomentoChat = 2
            break;
          case 'USD':
            this.messages.push({ text: 'Ingrese el Monto en USD a Convertir a COP', user: 'boot' });
            this.marcaMomentoChat = 2
            break;
          default:
            this.messages.push({ text: 'Mensaje no válido', user: 'boot' });
            break;
        };

      } else if (this.marcaMomentoChat === 2) {

        if (!isNaN(this.mensajeNuevo)) {
          this.messages.push({ text: this.mensajeNuevo, user: 'user' });

          //aca va el servicio de la concersion del valor
          const conversion = Number(this.mensajeNuevo)*5


          //muestra el mensja ede la respuesta
          this.messages.push({ text: String(conversion), user: 'boot' });


          //retornamos  al mensaje inicial
          this.messages.push({ text: this.mensagePideMoneda, user: 'boot' })
          this.marcaMomentoChat = 1


        } else {
          this.messages.push({ text: 'Mensaje no válido', user: 'boot' });
        }




      }






      // Poner el foco en el campo de entrada del mensaje
      const inputElement = document.querySelector('input[name="esc_mensaje"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
      setTimeout(() => {
        this.scrollMessageContainerToBottom();
      });
      this.mensajeNuevo = '';
    }


  }

  // Método para desplazar el contenedor de mensajes hacia abajo
  scrollMessageContainerToBottom() {
    if (this.messageContainer && this.messageContainer.nativeElement) {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}
