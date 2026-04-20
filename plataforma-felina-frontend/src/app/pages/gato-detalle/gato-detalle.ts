import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GatoService } from '../../services/gato';
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
  private cdr = inject(ChangeDetectorRef);

  gato: any = null;

  constructor(
    private route: ActivatedRoute,
    private gatoService: GatoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      console.log('ID recibido:', id);

      if (!id) return;

      this.gatoService.getGatoById(id).subscribe({
        next: (data) => {
          this.gato = data;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    });
  }

  abrirFormulario() {
    // Aquí podrías redirigir al formulario de adopción pasando el ID
  }
}
