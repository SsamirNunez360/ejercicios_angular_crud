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
  codigo = '';
  nombre = '';
  error = '';

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem(this.CLAVE_SESION)) {
      this.router.navigate(['/login']);
      return;
    }
    const guardado = localStorage.getItem(this.CLAVE_DATOS);
    this.registros = guardado ? JSON.parse(guardado) : [];
  }

  nuevo() {
    this.codigo = '';
    this.nombre = '';
    this.error = '';
  }

  guardar() {
    if (!this.codigo.trim() || !this.nombre.trim()) {
      this.error = 'Código y nombre son obligatorios.';
      return;
    }
    const item: Estudiante = {
      id: Math.max(0, ...this.registros.map((x) => x.id)) + 1,
      codigo: this.codigo.trim(),
      nombre: this.nombre.trim(),
    };
    this.registros.push(item);
    localStorage.setItem(this.CLAVE_DATOS, JSON.stringify(this.registros));
    this.nuevo();
  }
}
