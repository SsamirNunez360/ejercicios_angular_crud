import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  estado: string;
}

interface FormularioTarea {
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  estado: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-tarea',
  styleUrl: './tarea.component.css',
  templateUrl: './tarea.component.html',
})
export class TareaComponent implements OnInit {
  private readonly CLAVE_DATOS = 'agendaTareas';
  private readonly CLAVE_SESION = 'sesionTareas';

  tareas: Tarea[] = [];
  tarea: FormularioTarea = this.nuevo();
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
    this.tareas = guardado ? JSON.parse(guardado) : [];
  }

  nuevo(): FormularioTarea {
    return {
      titulo: '',
      descripcion: '',
      fechaLimite: '',
      estado: 'Pendiente',
    };
  }

  guardar() {
    if (!this.validar()) return;

    const f = this.tarea;
    const datos = {
      titulo: f.titulo.trim(),
      descripcion: f.descripcion.trim(),
      fechaLimite: f.fechaLimite,
      estado: f.estado,
    };

    if (this.editandoId === null) {
      // Crear: ID automático (máximo actual + 1), nunca se repite aunque se elimine.
      const id = Math.max(0, ...this.tareas.map((x) => x.id)) + 1;
      this.tareas.push({ id, ...datos });
    } else {
      // Actualizar: mismo ID y misma cantidad de filas.
      const id = this.editandoId;
      const i = this.tareas.findIndex((x) => x.id === id);
      if (i !== -1) this.tareas[i] = { id, ...datos };
    }

    this.persistir();
    this.cancelar();
  }

  editar(item: Tarea) {
    this.editandoId = item.id;
    // Se copia el registro: así cancelar no modifica lo guardado.
    this.tarea = {
      titulo: item.titulo,
      descripcion: item.descripcion,
      fechaLimite: item.fechaLimite,
      estado: item.estado,
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.tarea = this.nuevo();
    this.error = '';
  }

  eliminar(item: Tarea) {
    if (!confirm('¿Eliminar este registro?')) return;
    this.tareas = this.tareas.filter((x) => x.id !== item.id);
    this.persistir();
    if (this.editandoId === item.id) this.cancelar();
  }

  validar(): boolean {
    const f = this.tarea;
    if (!f.titulo.trim()) return this.fallo('El título es obligatorio.');
    if (!f.descripcion.trim()) return this.fallo('La descripción es obligatoria.');
    if (!f.fechaLimite) return this.fallo('La fecha límite es obligatoria.');
    if (f.estado !== 'Pendiente' && f.estado !== 'Completada') {
      return this.fallo('El estado debe ser Pendiente o Completada.');
    }
    this.error = '';
    return true;
  }

  private fallo(mensaje: string): boolean {
    this.error = mensaje;
    return false;
  }

  private persistir() {
    localStorage.setItem(this.CLAVE_DATOS, JSON.stringify(this.tareas));
  }

  cerrarSesion() {
    // Solo se borra la marca de sesión de esta aplicación; los registros se conservan.
    localStorage.removeItem(this.CLAVE_SESION);
    this.router.navigate(['/login']);
  }
}
