import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Mascota {
  id: number;
  codigo: string;
  nombre: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-mascota',
  styleUrl: './mascota.component.css',
  templateUrl: './mascota.component.html',
})
export class MascotaComponent implements OnInit {
  private readonly CLAVE_DATOS = 'veterinaria';
  private readonly CLAVE_SESION = 'sesionVeterinaria';

  registros: Mascota[] = [];

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
