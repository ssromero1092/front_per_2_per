
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicRoutingModule } from './public-routing.module';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    PublicRoutingModule,
    RouterModule
  ],
  declarations: [
    LoginComponent,
    ChatComponent,



  ],exports:[
    LoginComponent,
    ChatComponent,
    PublicRoutingModule
  ]
})
export class PublicModule { }
