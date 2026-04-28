import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GatoService } from '../../services/gato';
import { ApadrinamientoService, Apadrinamiento } from '../../services/apadrinamiento';
import { TarjetaPagoComponent } from '../../components/tarjeta-pago/tarjeta-pago';

@Component({
  selector: 'app-apadrinar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TarjetaPagoComponent],
  templateUrl: './apadrinar.html',
  styleUrls: ['./apadrinar.css']
})
export class ApadrinarComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private gatoService = inject(GatoService);
  private apadrinamientoService = inject(ApadrinamientoService);
  private cdr = inject(ChangeDetectorRef);

  gato: any = null;
  importeMensual: number | null = 5;
  enviando = false;
  exito = false;
  errorMsg = '';

  get importeValido(): boolean {
    return !!this.importeMensual && this.importeMensual >= 1;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('gatoId');
    if (id) {
      this.gatoService.getGatoById(id).subscribe({
        next: (data) => {
          this.gato = data;
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error al cargar el gato:', err)
      });
    }
  }

  onPagoConfirmado(evento: { ultimos4: string }) {
    if (!this.importeValido || this.enviando) return;
    const usuario = this.authService.user();
    if (!usuario) {
      this.errorMsg = 'Debes iniciar sesión para apadrinar.';
      return;
    }

    const apadrinamiento: Apadrinamiento = {
      usuario: { id: usuario.id },
      gato: { id: this.gato.id },
      importeMensual: this.importeMensual!,
      tarjetaUltimos4: evento.ultimos4
    };

    this.enviando = true;
    this.apadrinamientoService.crear(apadrinamiento).subscribe({
      next: () => {
        this.exito = true;
        this.enviando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.message || 'No se pudo registrar el apadrinamiento.';
        this.enviando = false;
        this.cdr.markForCheck();
      }
    });
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }
}
