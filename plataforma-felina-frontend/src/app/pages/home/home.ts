import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GatoService, Gato } from '../../services/gato';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private gatoService = inject(GatoService);
  private cdr = inject(ChangeDetectorRef);
  gatosAdoptados: Gato[] = [];

  ngOnInit() {
    this.gatoService.getGatosAdoptados().subscribe({
      next: (data) => {
        this.gatosAdoptados = data.slice(0, 4);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando gatos adoptados:', err),
    });
  }
}
