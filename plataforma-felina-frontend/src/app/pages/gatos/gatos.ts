import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GatoService, Gato } from '../../services/gato';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FavoritoService } from '../../services/favorito';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gatos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gatos.html',
  styleUrls: ['./gatos.css']
})
export class GatosComponent implements OnInit, OnDestroy {
  gatos: Gato[] = [];
  idsFavoritos = new Set<number>();
  private subFavoritos?: Subscription;

  filtroSexo: 'todos' | 'Macho' | 'Hembra' = 'todos';
  filtroEdad: 'todos' | 'cachorro' | 'joven' | 'adulto' = 'todos';
  filtroTipo: 'todos' | 'ADOPTABLE' | 'APADRINABLE' | 'ACOGIBLE' = 'todos';
  filtroUrgente = false;

  filtroCastrado = false;
  filtroMicrochip = false;
  filtroAptoNinos = false;
  filtroAptoOtrosGatos = false;
  filtroAptoPerros = false;

  filtrosVisibles = false;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private gatoService = inject(GatoService);
  private favoritoService = inject(FavoritoService);
  authService = inject(AuthService);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarGatos();
      this.subFavoritos = this.favoritoService.idsFavoritos$.subscribe((ids) => {
        this.idsFavoritos = ids;
        this.cdr.markForCheck();
      });
      const user = this.authService.user();
      if (user) {
        this.favoritoService.cargarIds(user.id).subscribe();
      }
    }
  }

  ngOnDestroy() {
    this.subFavoritos?.unsubscribe();
  }

  esFavorito(gatoId: number): boolean {
    return this.idsFavoritos.has(gatoId);
  }

  toggleFavorito(gato: Gato, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    const user = this.authService.user();
    if (!user) return;
    const obs = this.esFavorito(gato.id)
      ? this.favoritoService.quitar(user.id, gato.id)
      : this.favoritoService.agregar(user.id, gato.id);
    obs.subscribe({
      next: () => this.cdr.markForCheck(),
      error: (err) => console.error('Error favorito', err)
    });
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
      if (this.filtroCastrado && !g.castrado) return false;
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
    this.filtroCastrado = false;
    this.filtroMicrochip = false;
    this.filtroAptoNinos = false;
    this.filtroAptoOtrosGatos = false;
    this.filtroAptoPerros = false;
  }

  get filtrosActivos(): number {
    let n = 0;
    if (this.filtroSexo !== 'todos') n++;
    if (this.filtroEdad !== 'todos') n++;
    if (this.filtroTipo !== 'todos') n++;
    if (this.filtroUrgente) n++;
    if (this.filtroCastrado) n++;
    if (this.filtroMicrochip) n++;
    if (this.filtroAptoNinos) n++;
    if (this.filtroAptoOtrosGatos) n++;
    if (this.filtroAptoPerros) n++;
    return n;
  }
}
