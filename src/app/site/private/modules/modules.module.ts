import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Page404Component } from '../layouts/common/page404/page404.component';



@NgModule({
  declarations: [
    Page404Component
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ]
})
export class ModulesModule { }
