import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DonacionService, Donacion } from '../../services/donacion';
import { TarjetaPagoComponent } from '../../components/tarjeta-pago/tarjeta-pago';

@Component({
  selector: 'app-donar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TarjetaPagoComponent],
  templateUrl: './donar.html',
  styleUrls: ['./donar.css']
})
export class DonarComponent {
  authService = inject(AuthService);
  private donacionService = inject(DonacionService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  importesRapidos = [5, 10, 25, 50];
  importeSeleccionado: number | null = 10;
  importeOtro: number | null = null;

  mensaje = '';
  anonima = false;

  enviando = false;
  exito = false;
  errorMsg = '';

  get importeFinal(): number {
    return this.importeOtro && this.importeOtro >= 1
      ? this.importeOtro
      : this.importeSeleccionado || 0;
  }

  get importeValido(): boolean {
    return this.importeFinal >= 1;
  }

  seleccionarImporte(valor: number) {
    this.importeSeleccionado = valor;
    this.importeOtro = null;
  }

  onPagoConfirmado(evento: { ultimos4: string }) {
    if (!this.importeValido || this.enviando) return;

    const usuario = this.authService.user();
    const enviarAnonimo = this.anonima || !usuario;

    const donacion: Donacion = {
      cantidad: this.importeFinal,
      mensaje: this.mensaje?.trim() || undefined,
      tarjetaUltimos4: evento.ultimos4,
      anonima: enviarAnonimo,
      usuario: enviarAnonimo ? null : { id: usuario.id }
    };

    this.enviando = true;
    this.donacionService.crear(donacion).subscribe({
      next: () => {
        this.exito = true;
        this.enviando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudo procesar la donación. Inténtalo de nuevo.';
        this.enviando = false;
        this.cdr.markForCheck();
      }
    });
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }
}
