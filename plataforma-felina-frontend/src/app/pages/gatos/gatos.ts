import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GatoService, Gato } from '../../services/gato';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gatos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gatos.html',
  styleUrls: ['./gatos.css']
})
export class GatosComponent implements OnInit {
  gatos: Gato[] = [];

  filtroSexo: 'todos' | 'Macho' | 'Hembra' = 'todos';
  filtroEdad: 'todos' | 'cachorro' | 'joven' | 'adulto' = 'todos';
  filtroTipo: 'todos' | 'ADOPTABLE' | 'APADRINABLE' | 'ACOGIBLE' = 'todos';
  filtroUrgente = false;

  filtroVacunado = false;
  filtroCastrado = false;
  filtroDesparasitado = false;
  filtroMicrochip = false;
  filtroAptoNinos = false;
  filtroAptoOtrosGatos = false;
  filtroAptoPerros = false;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private gatoService = inject(GatoService);
  authService = inject(AuthService);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarGatos();
    }
  }

  cargarGatos() {
    this.gatoService.getGatosDisponibles().subscribe({
      next: (data) => {
        this.gatos = [...data];
        this.cdr.markForCheck();
      },
      error: (err) => console.error("Error detectado:", err)
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  iconoSexo(sexo: string): string {
    return sexo === 'Macho' ? '♂' : '♀';
  }

  etiquetaEstado(estado: string | null): string {
    switch (estado) {
      case 'ADOPTABLE': return 'Adoptable';
      case 'APADRINABLE': return 'Apadrinable';
      case 'ACOGIBLE': return 'En acogida';
      default: return '';
    }
  }

  get gatosFiltrados(): Gato[] {
    return this.gatos.filter(g => {
      if (this.filtroSexo !== 'todos' && g.sexo !== this.filtroSexo) return false;
      if (this.filtroTipo !== 'todos' && g.estado !== this.filtroTipo) return false;
      if (this.filtroUrgente && !g.urgente) return false;
      if (this.filtroEdad !== 'todos') {
        const edad = this.calcularEdad(g.fechaNacimiento);
        if (this.filtroEdad === 'cachorro' && edad >= 2) return false;
        if (this.filtroEdad === 'joven' && (edad < 2 || edad >= 7)) return false;
        if (this.filtroEdad === 'adulto' && edad < 7) return false;
      }
      if (this.filtroVacunado && !g.vacunado) return false;
      if (this.filtroCastrado && !g.castrado) return false;
      if (this.filtroDesparasitado && !g.desparasitado) return false;
      if (this.filtroMicrochip && !g.microchip) return false;
      if (this.filtroAptoNinos && !g.aptoNinos) return false;
      if (this.filtroAptoOtrosGatos && !g.aptoOtrosGatos) return false;
      if (this.filtroAptoPerros && !g.aptoPerros) return false;
      return true;
    });
  }

  resetFiltros() {
    this.filtroSexo = 'todos';
    this.filtroEdad = 'todos';
    this.filtroTipo = 'todos';
    this.filtroUrgente = false;
    this.filtroVacunado = false;
    this.filtroCastrado = false;
    this.filtroDesparasitado = false;
    this.filtroMicrochip = false;
    this.filtroAptoNinos = false;
    this.filtroAptoOtrosGatos = false;
    this.filtroAptoPerros = false;
  }
}
