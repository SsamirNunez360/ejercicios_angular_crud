import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  existencias: number;
}

interface FormularioProducto {
  codigo: string;
  nombre: string;
  precio: number | null;
  existencias: number | null;
}

@Component({
  imports: [FormsModule],
  selector: 'app-producto',
  styleUrl: './producto.component.css',
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  private readonly CLAVE_DATOS = 'productosTienda';
  private readonly CLAVE_SESION = 'sesionTienda';

  productos: Producto[] = [];
  producto: FormularioProducto = this.nuevo();
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
    this.productos = guardado ? JSON.parse(guardado) : [];
  }

  nuevo(): FormularioProducto {
    return {
      codigo: '',
      nombre: '',
      precio: null,
      existencias: null,
    };
  }

  guardar() {
    if (!this.validar()) return;

    const f = this.producto;
    const datos = {
      codigo: f.codigo.trim(),
      nombre: f.nombre.trim(),
      precio: f.precio as number,
      existencias: f.existencias as number,
    };

    if (this.editandoId === null) {
      // Crear: ID automático (máximo actual + 1), nunca se repite aunque se elimine.
      const id = Math.max(0, ...this.productos.map((x) => x.id)) + 1;
      this.productos.push({ id, ...datos });
    } else {
      // Actualizar: mismo ID y misma cantidad de filas.
      const id = this.editandoId;
      const i = this.productos.findIndex((x) => x.id === id);
      if (i !== -1) this.productos[i] = { id, ...datos };
    }

    this.persistir();
    this.cancelar();
  }

  editar(item: Producto) {
    this.editandoId = item.id;
    // Se copia el registro: así cancelar no modifica lo guardado.
    this.producto = {
      codigo: item.codigo,
      nombre: item.nombre,
      precio: item.precio,
      existencias: item.existencias,
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.producto = this.nuevo();
    this.error = '';
  }

  eliminar(item: Producto) {
    if (!confirm('¿Eliminar este registro?')) return;
    this.productos = this.productos.filter((x) => x.id !== item.id);
    this.persistir();
    if (this.editandoId === item.id) this.cancelar();
  }

  validar(): boolean {
    const f = this.producto;
    if (!f.codigo.trim()) return this.fallo('El código es obligatorio.');
    if (!f.nombre.trim()) return this.fallo('El nombre es obligatorio.');
    if (typeof f.precio !== 'number' || !Number.isFinite(f.precio) || f.precio <= 0) {
      return this.fallo('El precio debe ser mayor que cero.');
    }
    if (typeof f.existencias !== 'number' || !Number.isInteger(f.existencias) || f.existencias < 0) {
      return this.fallo('Las existencias deben ser un entero mayor o igual que cero.');
    }
    this.error = '';
    return true;
  }

  private fallo(mensaje: string): boolean {
    this.error = mensaje;
    return false;
  }

  private persistir() {
    localStorage.setItem(this.CLAVE_DATOS, JSON.stringify(this.productos));
  }

  cerrarSesion() {
    // Solo se borra la marca de sesión de esta aplicación; los registros se conservan.
    localStorage.removeItem(this.CLAVE_SESION);
    this.router.navigate(['/login']);
  }
}
