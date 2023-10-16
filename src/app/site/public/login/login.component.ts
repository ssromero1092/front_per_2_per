import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  STORAGELOGIN = environment.STORAGELOGIN;

  constructor(
    private routes: Router,
  ) { }

  ngOnInit(): void {
  }

  usuario = {
    nombre_usuario:'',
  };

  ngOnSubmit(event: Event) {
    console.log(this.usuario.nombre_usuario);
    localStorage.setItem(this.STORAGELOGIN,this.usuario.nombre_usuario)
    this.routes.navigate(['/chat'])



  }

}
