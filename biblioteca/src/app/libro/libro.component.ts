import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Libro {
  id: number;
  codigo: string;
  titulo: string;
  autor: string;
  anio: number;
}

interface FormularioLibro {
  codigo: string;
  titulo: string;
  autor: string;
  anio: number | null;
}

@Component({
  imports: [FormsModule],
  selector: 'app-libro',
  styleUrl: './libro.component.css',
  templateUrl: './libro.component.html',
})
export class LibroComponent implements OnInit {
  private readonly CLAVE_DATOS = 'librosBiblioteca';
  private readonly CLAVE_SESION = 'sesionBiblioteca';

  libros: Libro[] = [];
  libro: FormularioLibro = this.nuevo();
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
    this.libros = guardado ? JSON.parse(guardado) : [];
  }

  nuevo(): FormularioLibro {
    return {
      codigo: '',
      titulo: '',
      autor: '',
      anio: null,
    };
  }

  guardar() {
    if (!this.validar()) return;

    const f = this.libro;
    const datos = {
      codigo: f.codigo.trim(),
      titulo: f.titulo.trim(),
      autor: f.autor.trim(),
      anio: f.anio as number,
    };

    if (this.editandoId === null) {
      // Crear: ID automático (máximo actual + 1), nunca se repite aunque se elimine.
      const id = Math.max(0, ...this.libros.map((x) => x.id)) + 1;
      this.libros.push({ id, ...datos });
    } else {
      // Actualizar: mismo ID y misma cantidad de filas.
      const id = this.editandoId;
      const i = this.libros.findIndex((x) => x.id === id);
      if (i !== -1) this.libros[i] = { id, ...datos };
    }

    this.persistir();
    this.cancelar();
  }

  editar(item: Libro) {
    this.editandoId = item.id;
    // Se copia el registro: así cancelar no modifica lo guardado.
    this.libro = {
      codigo: item.codigo,
      titulo: item.titulo,
      autor: item.autor,
      anio: item.anio,
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.libro = this.nuevo();
    this.error = '';
  }

  eliminar(item: Libro) {
    if (!confirm('¿Eliminar este registro?')) return;
    this.libros = this.libros.filter((x) => x.id !== item.id);
    this.persistir();
    if (this.editandoId === item.id) this.cancelar();
  }

  validar(): boolean {
    const f = this.libro;
    if (!f.codigo.trim()) return this.fallo('El código es obligatorio.');
    if (!f.titulo.trim()) return this.fallo('El título es obligatorio.');
    if (!f.autor.trim()) return this.fallo('El autor es obligatorio.');
    if (typeof f.anio !== 'number' || !Number.isInteger(f.anio) || f.anio < 1000 || f.anio > 9999) {
      return this.fallo('El año debe ser un entero de cuatro cifras (1000 a 9999).');
    }
    this.error = '';
    return true;
  }

  private fallo(mensaje: string): boolean {
    this.error = mensaje;
    return false;
  }

  private persistir() {
    localStorage.setItem(this.CLAVE_DATOS, JSON.stringify(this.libros));
  }

  cerrarSesion() {
    // Solo se borra la marca de sesión de esta aplicación; los registros se conservan.
    localStorage.removeItem(this.CLAVE_SESION);
    this.router.navigate(['/login']);
  }
}
