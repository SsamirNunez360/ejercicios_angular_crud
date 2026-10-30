import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Estudiante {
  id: number;
  cuenta: string;
  nombre: string;
  carrera: string;
  fechaIngreso: string;
}

interface FormularioEstudiante {
  cuenta: string;
  nombre: string;
  carrera: string;
  fechaIngreso: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-estudiante',
  styleUrl: './estudiante.component.css',
  templateUrl: './estudiante.component.html',
})
export class EstudianteComponent implements OnInit {
  private readonly CLAVE_DATOS = 'registrosEstudiantes';
  private readonly CLAVE_SESION = 'sesionEstudiantes';

  estudiantes: Estudiante[] = [];
  estudiante: FormularioEstudiante = this.nuevo();
  editandoId: number | null = null;
  error = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Sin marca de sesión de esta aplicación, se regresa al login.
    if (!localStorage.getItem(this.CLAVE_SESION)) {
      this.router.navigate(['/login']);
      return;
    }
    const guardado = localStorage.getItem(this.CLAVE_DATOS);
    this.estudiantes = guardado ? JSON.parse(guardado) : [];
  }

  nuevo(): FormularioEstudiante {
    return {
      cuenta: '',
      nombre: '',
      carrera: '',
      fechaIngreso: '',
    };
  }

  guardar() {
    if (!this.validar()) return;

    const f = this.estudiante;
    const datos = {
      cuenta: f.cuenta.trim(),
      nombre: f.nombre.trim(),
      carrera: f.carrera.trim(),
      fechaIngreso: f.fechaIngreso,
    };

    if (this.editandoId === null) {
      // Crear: ID automático (máximo actual + 1), nunca se repite aunque se elimine.
      const id = Math.max(0, ...this.estudiantes.map((x) => x.id)) + 1;
      this.estudiantes.push({ id, ...datos });
    } else {
      // Actualizar: mismo ID y misma cantidad de filas.
      const id = this.editandoId;
      const i = this.estudiantes.findIndex((x) => x.id === id);
      if (i !== -1) this.estudiantes[i] = { id, ...datos };
    }

    this.persistir();
    this.cancelar();
  }

  editar(item: Estudiante) {
    this.editandoId = item.id;
    // Se copia el registro: así cancelar no modifica lo guardado.
    this.estudiante = {
      cuenta: item.cuenta,
      nombre: item.nombre,
      carrera: item.carrera,
      fechaIngreso: item.fechaIngreso,
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.estudiante = this.nuevo();
    this.error = '';
  }

  eliminar(item: Estudiante) {
    if (!confirm('¿Eliminar este registro?')) return;
    this.estudiantes = this.estudiantes.filter((x) => x.id !== item.id);
    this.persistir();
    if (this.editandoId === item.id) this.cancelar();
  }

  validar(): boolean {
    const f = this.estudiante;
    if (!f.cuenta.trim()) return this.fallo('La cuenta es obligatoria.');
    if (!f.nombre.trim()) return this.fallo('El nombre es obligatorio.');
    if (!f.carrera.trim()) return this.fallo('La carrera es obligatoria.');
    if (!f.fechaIngreso) return this.fallo('La fecha de ingreso es obligatoria.');
    this.error = '';
    return true;
  }

  private fallo(mensaje: string): boolean {
    this.error = mensaje;
    return false;
  }

  private persistir() {
    localStorage.setItem(this.CLAVE_DATOS, JSON.stringify(this.estudiantes));
  }

  cerrarSesion() {
    // Solo se borra la marca de sesión de esta aplicación; los registros se conservan.
    localStorage.removeItem(this.CLAVE_SESION);
    this.router.navigate(['/login']);
  }
}
