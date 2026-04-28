import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GatoService } from '../../services/gato';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gato-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gato-detalle.html',
  styleUrl: './gato-detalle.css'
})
export class GatoDetalleComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  gato: any = null;
  isLoggedIn: boolean = false;

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
      }
    });
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
