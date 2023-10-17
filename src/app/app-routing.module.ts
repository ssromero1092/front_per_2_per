import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './site/private/layouts/common/page404/page404.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./site/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./site/private/modules/modules.module').then(m => m.ModulesModule)
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
