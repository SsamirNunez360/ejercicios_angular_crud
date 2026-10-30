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
    if (this.usuario === 'bibliotecario' && this.clave === 'biblio123') {
      localStorage.setItem('sesionBiblioteca', 'activa');
      this.router.navigate(['/libros']);
    } else {
      this.mensaje = 'Usuario o contraseña incorrectos.';
    }
  }
}
