// Importación de módulos y componentes necesarios
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',                                        // Selector del componente
  templateUrl: './login.component.html',                        // Plantilla HTML asociada al componente
  styleUrls: ['./login.component.css']                          // Estilos CSS asociados al componente
})
export class LoginComponent implements OnInit {
  // Clave para el almacenamiento en el almacenamiento local
  storageLoginKey: string = environment.STORAGELOGIN;
  // Objeto para almacenar el nombre de usuario
  usuario: {
    nombre_usuario: string
  } = { nombre_usuario: '' };
  constructor(
    private router: Router
    ) { }                        // Constructor del componente

  ngOnInit(): void {
    // Método llamado cuando el componente se inicia
    localStorage.setItem(this.storageLoginKey, '');
  }

  onSubmit(event: Event): void {
    // Método llamado para ir al formulario chat
    localStorage.setItem(this.storageLoginKey, this.usuario.nombre_usuario);  // Almacenar el nombre de usuario en el almacenamiento local
    this.router.navigate(['/chat']);                                          // Redirigir al componente 'chat'
  }
}
