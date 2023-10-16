
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'chat', component: ChatComponent},

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class PublicRoutingModule { }
