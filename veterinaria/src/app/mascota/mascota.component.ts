import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  propietario: string;
}

interface FormularioMascota {
  nombre: string;
  especie: string;
  edad: number | null;
  propietario: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-mascota',
  styleUrl: './mascota.component.css',
  templateUrl: './mascota.component.html',
})
export class MascotaComponent implements OnInit {
  private readonly CLAVE_DATOS = 'mascotasVeterinaria';
  private readonly CLAVE_SESION = 'sesionVeterinaria';

  mascotas: Mascota[] = [];
  mascota: FormularioMascota = this.nuevo();
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
    this.mascotas = guardado ? JSON.parse(guardado) : [];
  }

  nuevo(): FormularioMascota {
    return {
      nombre: '',
      especie: '',
      edad: null,
      propietario: '',
    };
  }

  guardar() {
    if (!this.validar()) return;

    const f = this.mascota;
    const datos = {
      nombre: f.nombre.trim(),
      especie: f.especie.trim(),
      edad: f.edad as number,
      propietario: f.propietario.trim(),
    };

    if (this.editandoId === null) {
      // Crear: ID automático (máximo actual + 1), nunca se repite aunque se elimine.
      const id = Math.max(0, ...this.mascotas.map((x) => x.id)) + 1;
      this.mascotas.push({ id, ...datos });
    } else {
      // Actualizar: mismo ID y misma cantidad de filas.
      const id = this.editandoId;
      const i = this.mascotas.findIndex((x) => x.id === id);
      if (i !== -1) this.mascotas[i] = { id, ...datos };
    }

    this.persistir();
    this.cancelar();
  }

  editar(item: Mascota) {
    this.editandoId = item.id;
    // Se copia el registro: así cancelar no modifica lo guardado.
    this.mascota = {
      nombre: item.nombre,
      especie: item.especie,
      edad: item.edad,
      propietario: item.propietario,
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.mascota = this.nuevo();
    this.error = '';
  }

  eliminar(item: Mascota) {
    if (!confirm('¿Eliminar este registro?')) return;
    this.mascotas = this.mascotas.filter((x) => x.id !== item.id);
    this.persistir();
    if (this.editandoId === item.id) this.cancelar();
  }

  validar(): boolean {
    const f = this.mascota;
    if (!f.nombre.trim()) return this.fallo('El nombre es obligatorio.');
    if (!f.especie.trim()) return this.fallo('La especie es obligatoria.');
    if (typeof f.edad !== 'number' || !Number.isInteger(f.edad) || f.edad < 0) {
      return this.fallo('La edad debe ser un entero mayor o igual que cero.');
    }
    if (!f.propietario.trim()) return this.fallo('El propietario es obligatorio.');
    this.error = '';
    return true;
  }

  private fallo(mensaje: string): boolean {
    this.error = mensaje;
    return false;
  }

  private persistir() {
    localStorage.setItem(this.CLAVE_DATOS, JSON.stringify(this.mascotas));
  }

  cerrarSesion() {
    // Solo se borra la marca de sesión de esta aplicación; los registros se conservan.
    localStorage.removeItem(this.CLAVE_SESION);
    this.router.navigate(['/login']);
  }
}
