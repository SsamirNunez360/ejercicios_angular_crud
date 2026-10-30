import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  usuario = '';
  clave = '';
  mensaje = '';

  constructor(private router: Router) {}

  ingresar() {
    if (this.usuario === 'vendedor' && this.clave === 'tienda123') {
      localStorage.setItem('sesionTienda', 'activa');
      this.router.navigate([/productos]);
    } else {
      this.mensaje = 'Usuario o contraseña incorrectos.';
    }
  }
}
