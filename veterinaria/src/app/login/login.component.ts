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
    // Acceso de práctica (simulación educativa con datos ficticios).
    if (this.usuario === 'veterinario' && this.clave === 'mascotas123') {
      localStorage.setItem('sesionVeterinaria', 'activa');
      this.router.navigate(['/mascotas']);
    } else {
      this.mensaje = 'Usuario o contraseña incorrectos.';
    }
  }
}
