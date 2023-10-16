import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from '../../public/chat/chat.component';


const routes: Routes = [
  {
    path: '',

    children: [

      {
        //	canActivate: [AuthGuard],
        path: '',
        component: ChatComponent,
        data: {
          title: 'chat',
          urls: [
            { title: 'Dashboard' },
            { title: 'chat' },

          ]
        }
      },


    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
