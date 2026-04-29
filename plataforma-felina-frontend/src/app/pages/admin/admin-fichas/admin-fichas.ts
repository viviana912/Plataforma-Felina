import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FichaService } from '../../../services/fichas';

@Component({
  selector: 'app-admin-fichas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-fichas.html',
  styleUrls: ['./admin-fichas.css']
})
export class AdminFichasComponent implements OnInit {
  private fichaService = inject(FichaService);
  private cdr = inject(ChangeDetectorRef);

  gatos: any[] = [];
  gatoEditando: any = null;
  gatoParaBorrar: any = null;
  subiendoFoto = false;
  errorSubida: string | null = null;

  ngOnInit() {
    this.cargarGatos();
  }

  cargarGatos() {
    this.fichaService.getGatos().subscribe({
      next: (res) => {
        this.gatos = res;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar gatos:', err)
    });
  }

  seleccionarParaEditar(gato: any) {
    this.gatoEditando = { ...gato };
  }

  nuevoGato() {
    this.gatoEditando = {
      nombre: '',
      sexo: 'Macho',
      fechaNacimiento: '',
      raza: '',
      color: '',
      vacunas: '',
      caracter: '',
      notas: '',
      estado: 'ADOPTABLE',
      urgente: false,
      fotoUrl: '',
      vacunado: false,
      castrado: false,
      desparasitado: false,
      microchip: false,
      aptoNinos: false,
      aptoOtrosGatos: false,
      aptoPerros: false
    };
  }

  cerrarEditor() {
    this.gatoEditando = null;
  }

  guardarGato() {
    if (!this.gatoEditando.nombre) return;

    this.fichaService.saveGato(this.gatoEditando).subscribe({
      next: () => {
        this.cargarGatos();
        this.cerrarEditor();
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }

  abrirModalBorrar(gato: any) {
    this.gatoParaBorrar = gato;
  }

  confirmarBorrado() {
    if (this.gatoParaBorrar) {
      this.fichaService.deleteGato(this.gatoParaBorrar.id).subscribe({
        next: () => {
          this.cargarGatos();
          this.gatoParaBorrar = null;
        }
      });
    }
  }

  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    this.errorSubida = null;
    this.subiendoFoto = true;
    this.cdr.markForCheck();

    this.fichaService.uploadFoto(file).subscribe({
      next: (res) => {
        this.gatoEditando.fotoUrl = res.fullUrl;
        this.subiendoFoto = false;
        input.value = '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorSubida = err?.error?.error || 'No se pudo subir la imagen';
        this.subiendoFoto = false;
        this.cdr.markForCheck();
      }
    });
  }
}
