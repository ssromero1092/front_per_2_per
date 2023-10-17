import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiChatService } from 'src/app/utils/service/per2per/api.chat.service';
import { environment } from 'src/environments/environment';
import { NgModel } from '@angular/forms';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  STORAGELOGIN = environment.STORAGELOGIN;

  constructor(
    private routes: Router,
    private apiChat: ApiChatService
  ) {
  }
  // Elemento de la interfaz de usuario que se referencia al contenedor de mensajes.
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  // Arreglo para almacenar mensajes en el chat
  messages: { text: string; user: string; }[] = [];

  // Variable para almacenar el mensaje ingresado por el usuario o por el boot
  mensajeNuevo: string = '';
  mensajeNuevoValor: number = 0;

  // Mensaje inicial del chat
  mensagePideMoneda: string = '';

  // variable que guarda el tipo de moneda
  mensageTipoModena: string = '';


  // Variable para controlar el estado del chat (esperando tipo de cambio == 1  o monto ==2)
  marcaMomentoChat: number = 0;

  usuario: any;
  ngOnInit(): void {
    this.usuario = localStorage.getItem(this.STORAGELOGIN);
    this.mensagePideMoneda = `Hola ${this.usuario}, Espero que tengas un excelente día, si quieres convertir dinero de Pesos Colombianos (COP) a Dólar (USD) escribe USD; de lo contrario, escribe COP.`;
    if (!this.usuario) {
      this.routes.navigate(['/login']);
    };
    console.log(this.usuario);
    this.messages.push({ text: this.mensagePideMoneda, user: 'boot' });
    this.marcaMomentoChat = 1;
  }

  // Método para enviar un mensaje en el chat
  sendMessage() {
    if (this.mensajeNuevo) {
      if (this.marcaMomentoChat === 1) {
        this.messages.push({ text: this.mensajeNuevo, user: 'user' });
        const mensajeMayusculas = this.mensajeNuevo.toUpperCase();
        this.mensageTipoModena = mensajeMayusculas
        switch (mensajeMayusculas) {
          case 'COP':
            this.messages.push({ text: 'Ingrese el Monto en COP a Convertir a USD', user: 'boot' });
            this.marcaMomentoChat = 2;
            break;
          case 'USD':
            this.messages.push({ text: 'Ingrese el Monto en USD a Convertir a COP', user: 'boot' });
            this.marcaMomentoChat = 2;
            break;
          default:
            this.messages.push({ text: 'Mensaje no válido', user: 'boot' });
            break;
        };
        this.limpiaFocus();
      } else if (this.marcaMomentoChat === 2) {
        this.mensajeNuevoValor = parseInt(this.mensajeNuevo)
        if (!isNaN(this.mensajeNuevoValor)) {
          let conversion: any
          const formattedConversion = this.formatCurrency(this.mensajeNuevoValor, this.mensageTipoModena);
          this.messages.push({ text: formattedConversion, user: 'user' });
          // servicio de la conversion  del valor
          this.apiChat.postChat(this.usuario, Number(this.mensajeNuevoValor), this.mensageTipoModena).subscribe((res: any) => {
            const chat = res['status'] === 200 ? res['body']['data'] : [];

            if (this.mensageTipoModena == 'USD') {
              conversion = Number(chat.quotes.USDCOP) * Number(this.mensajeNuevoValor);
            } else {
              conversion = Number(chat.quotes.COPUSD) * Number(this.mensajeNuevoValor);
            }
            const formattedConversion = this.formatCurrency(conversion, this.mensageTipoModena);
            //muestra el mensja ede la respuesta
            this.messages.push({ text: formattedConversion, user: 'boot' });
            //retornamos  al mensaje inicial
            this.messages.push({ text: this.mensagePideMoneda, user: 'boot' });
            this.marcaMomentoChat = 1;
            this.limpiaFocus();
          });
        } else {
          this.messages.push({ text: 'Mensaje no válido', user: 'boot' });
        }
      }






      // Poner el foco en el campo de entrada del mensaje

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


  limpiaFocus() {
    const inputElement = document.querySelector('input[name="esc_mensaje"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
    setTimeout(() => {
      this.scrollMessageContainerToBottom();
    });
  }

  formatCurrency(value: number, currencyType: string): string {
    const currencySymbol = currencyType === 'USD' ? '$' : '$';
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyType,
      minimumFractionDigits: 2,
    }).format(value);
    return formattedValue;
  }
}
