import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GatoService, Gato } from '../../services/gato';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-gatos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gatos.html',
  styleUrls: ['./gatos.css']
})
export class GatosComponent implements OnInit {
  gatos: Gato[] = [];

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private gatoService = inject(GatoService);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarGatos();
    }
  }

  cargarGatos() {
    this.gatoService.getGatos().subscribe({
      next: (data) => {
        this.gatos = [...data];
        this.cdr.markForCheck();
      },
      error: (err) => console.error("Error detectado:", err)
    });
  }

  solicitarAdopcion(id: number) {
    console.log("¡Click detectado! Quieres adoptar al gato con ID:", id);


  }

}
