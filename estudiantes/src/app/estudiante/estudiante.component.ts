import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Estudiante {
  id: number;
  codigo: string;
  nombre: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-estudiante',
  styleUrl: './estudiante.component.css',
  templateUrl: './estudiante.component.html',
})
export class EstudianteComponent implements OnInit {
  private readonly CLAVE_DATOS = 'estudiantes';
  private readonly CLAVE_SESION = 'sesionEstudiantes';

  registros: Estudiante[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem(this.CLAVE_SESION)) {
      this.router.navigate(['/login']);
      return;
    }

    const guardado = localStorage.getItem(this.CLAVE_DATOS);
    this.registros = guardado ? JSON.parse(guardado) : [];
  }
}
