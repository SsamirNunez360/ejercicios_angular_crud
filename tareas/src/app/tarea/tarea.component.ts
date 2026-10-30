import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Tarea {
  id: number;
  codigo: string;
  nombre: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-tarea',
  styleUrl: './tarea.component.css',
  templateUrl: './tarea.component.html',
})
export class TareaComponent implements OnInit {
  private readonly CLAVE_DATOS = 'tareas';
  private readonly CLAVE_SESION = 'sesionTareas';

  registros: Tarea[] = [];
  codigo = '';
  nombre = '';
  editandoId: number | null = null;
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
    this.editandoId = null;
    this.error = '';
  }

  guardar() {
    if (!this.codigo.trim() || !this.nombre.trim()) { this.error = 'Código y nombre son obligatorios.'; return; }
    if (this.editandoId === null) {
      const item: Tarea = { id: Math.max(0, ...this.registros.map((x) => x.id)) + 1, codigo: this.codigo.trim(), nombre: this.nombre.trim() };
      this.registros.push(item);
    } else {
      const i = this.registros.findIndex((x) => x.id === this.editandoId);
      if (i !== -1) this.registros[i] = { id: this.editandoId, codigo: this.codigo.trim(), nombre: this.nombre.trim() };
    }
    localStorage.setItem(this.CLAVE_DATOS, JSON.stringify(this.registros));
    this.nuevo();
  }

  editar(item: Tarea) {
    this.editandoId = item.id;
    this.codigo = item.codigo;
    this.nombre = item.nombre;
    this.error = '';
  }
}
