import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-producto',
  styleUrl: './producto.component.css',
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  private readonly CLAVE_DATOS = 'tienda';
  private readonly CLAVE_SESION = 'sesionTienda';

  registros: Producto[] = [];

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
