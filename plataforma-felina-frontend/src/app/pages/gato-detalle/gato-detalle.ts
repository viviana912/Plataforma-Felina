import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GatoService } from '../../services/gato'; // Ajusta la ruta a tu servicio
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gato-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gato-detalle.html',
  styleUrl: './gato-detalle.css'
})
export class GatoDetalleComponent implements OnInit {

  gato: any = null; // Aquí se guardará el objeto que traiga el backend

  constructor(
    private route: ActivatedRoute,
    private gatoService: GatoService // Inyectamos tu servicio real
  ) {

  }

  ngOnInit(): void {
    // Capturamos el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Llamada real a tu base de datos a través del servicio
      this.gatoService.getGatoById(id).subscribe({
        next: (data) => {
          this.gato = data;
        },
        error: (err) => {
          console.error('Error al traer el gato de la base de datos', err);
        }
      });
    }
  }

  abrirFormulario() {
    // Aquí podrías redirigir al formulario de adopción pasando el ID
  }
}
