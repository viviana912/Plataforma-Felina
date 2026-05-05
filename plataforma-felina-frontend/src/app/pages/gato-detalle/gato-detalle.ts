import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GatoService } from '../../services/gato';
import { AuthService } from '../../services/auth.service';
import { FavoritoService } from '../../services/favorito';
import { ActualizacionGatoService, ActualizacionGato } from '../../services/actualizacion-gato';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-gato-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  templateUrl: './gato-detalle.html',
  styleUrl: './gato-detalle.css'
})
export class GatoDetalleComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);
  private favoritoService = inject(FavoritoService);
  private actualizacionService = inject(ActualizacionGatoService);

  gato: any = null;
  isLoggedIn: boolean = false;
  esFavorito = false;
  actualizaciones: ActualizacionGato[] = [];
  imagenAmpliada: string | null = null;
  private subFavoritos?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private gatoService: GatoService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.gatoService.getGatoById(id).subscribe({
          next: (data) => {
            this.gato = data;
            this.cdr.markForCheck();
          },
          error: (err) => console.error('Error:', err)
        });
        this.actualizacionService.getDeGato(Number(id)).subscribe({
          next: (data) => {
            this.actualizaciones = data;
            this.cdr.markForCheck();
          },
          error: (err) => console.error('Error cargando diario:', err)
        });
      }
    });

    if (this.isLoggedIn) {
      const user = this.authService.user();
      if (user) {
        this.favoritoService.cargarIds(user.id).subscribe();
      }
      this.subFavoritos = this.favoritoService.idsFavoritos$.subscribe((ids) => {
        this.esFavorito = !!this.gato && ids.has(this.gato.id);
        this.cdr.markForCheck();
      });
    }
  }

  ngOnDestroy() {
    this.subFavoritos?.unsubscribe();
  }

  toggleFavorito() {
    const user = this.authService.user();
    if (!user || !this.gato) return;
    const obs = this.esFavorito
      ? this.favoritoService.quitar(user.id, this.gato.id)
      : this.favoritoService.agregar(user.id, this.gato.id);
    obs.subscribe({
      next: () => this.cdr.markForCheck(),
      error: (err) => console.error('Error favorito', err)
    });
  }

  abrirImagen(url: string | undefined, e: Event) {
    if (!url) return;
    e.stopPropagation();
    e.preventDefault();
    this.imagenAmpliada = url;
  }

  cerrarImagen() {
    this.imagenAmpliada = null;
  }

  abrirFormulario() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    let ruta = '/adoptar';
    if (this.gato?.estado === 'APADRINABLE') ruta = '/apadrinar';
    else if (this.gato?.estado === 'ACOGIBLE') ruta = '/acoger';
    this.router.navigate([ruta, this.gato.id]);
  }

  get textoBoton(): string {
    if (!this.gato) return '';
    if (this.gato.estado === 'APADRINABLE') return `Apadrinar a ${this.gato.nombre}`;
    if (this.gato.estado === 'ACOGIBLE') return 'Ofrecerme como casa de acogida';
    return 'Presentar solicitud de adopción';
  }

  get textoBotonLogin(): string {
    if (!this.gato) return 'Iniciar sesión';
    if (this.gato.estado === 'APADRINABLE') return 'Iniciar sesión para apadrinar';
    if (this.gato.estado === 'ACOGIBLE') return 'Iniciar sesión para acoger';
    return 'Iniciar sesión para adoptar';
  }
}
