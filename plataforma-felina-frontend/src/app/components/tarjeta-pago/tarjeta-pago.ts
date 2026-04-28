import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  cvvValido,
  expValida,
  formatearExp,
  formatearNumeroTarjeta,
  luhnValid
} from '../../utils/card-validation';

@Component({
  selector: 'app-tarjeta-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarjeta-pago.html',
  styleUrls: ['./tarjeta-pago.css']
})
export class TarjetaPagoComponent {
  @Input() ctaLabel: string = 'Pagar';
  @Input() disabled: boolean = false;
  @Output() confirmado = new EventEmitter<{ ultimos4: string }>();

  numero = '';
  exp = '';
  cvv = '';
  titular = '';
  errorMsg = '';

  onNumeroInput(value: string) {
    this.numero = formatearNumeroTarjeta(value);
  }

  onExpInput(value: string) {
    this.exp = formatearExp(value);
  }

  onSubmit() {
    this.errorMsg = '';
    const numeroLimpio = this.numero.replace(/\s/g, '');

    if (!this.titular.trim()) {
      this.errorMsg = 'Introduce el nombre del titular.';
      return;
    }
    if (!luhnValid(numeroLimpio)) {
      this.errorMsg = 'Número de tarjeta inválido.';
      return;
    }
    if (!expValida(this.exp)) {
      this.errorMsg = 'Fecha de expiración inválida o caducada.';
      return;
    }
    if (!cvvValido(this.cvv)) {
      this.errorMsg = 'CVV inválido (3 o 4 dígitos).';
      return;
    }

    const ultimos4 = numeroLimpio.slice(-4);
    this.confirmado.emit({ ultimos4 });
  }
}
