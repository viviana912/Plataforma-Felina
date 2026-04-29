import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FichaService } from '../../../services/fichas';
import { ActualizacionGatoService, ActualizacionGato } from '../../../services/actualizacion-gato';

@Component({
  selector: 'app-admin-fichas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-fichas.html',
  styleUrls: ['./admin-fichas.css']
})
export class AdminFichasComponent implements OnInit {
  private fichaService = inject(FichaService);
  private actualizacionService = inject(ActualizacionGatoService);
  private cdr = inject(ChangeDetectorRef);

  gatos: any[] = [];
  gatoEditando: any = null;
  gatoParaBorrar: any = null;
  subiendoFoto = false;
  errorSubida: string | null = null;

  actualizacionesGato: ActualizacionGato[] = [];
  mostrarFormActualizacion = false;
  nuevaActualizacion: ActualizacionGato = { titulo: '', mensaje: '', fotoUrl: '' };
  subiendoFotoAct = false;
  errorActualizacion: string | null = null;

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
    this.cargarActualizaciones(gato.id);
  }

  cargarActualizaciones(gatoId: number) {
    if (!gatoId) {
      this.actualizacionesGato = [];
      return;
    }
    this.actualizacionService.getDeGato(gatoId).subscribe({
      next: (data) => {
        this.actualizacionesGato = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando actualizaciones', err)
    });
  }

  abrirFormActualizacion() {
    this.nuevaActualizacion = { titulo: '', mensaje: '', fotoUrl: '' };
    this.errorActualizacion = null;
    this.mostrarFormActualizacion = true;
  }

  cancelarActualizacion() {
    this.mostrarFormActualizacion = false;
    this.errorActualizacion = null;
  }

  onFotoActSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.subiendoFotoAct = true;
    this.errorActualizacion = null;
    this.cdr.markForCheck();
    this.fichaService.uploadFoto(file).subscribe({
      next: (res) => {
        this.nuevaActualizacion.fotoUrl = res.fullUrl;
        this.subiendoFotoAct = false;
        input.value = '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorActualizacion = err?.error?.error || 'No se pudo subir la imagen';
        this.subiendoFotoAct = false;
        this.cdr.markForCheck();
      }
    });
  }

  guardarActualizacion() {
    if (!this.gatoEditando?.id) return;
    if (!this.nuevaActualizacion.titulo) {
      this.errorActualizacion = 'El título es obligatorio.';
      return;
    }
    this.actualizacionService.crear(this.gatoEditando.id, this.nuevaActualizacion).subscribe({
      next: () => {
        this.mostrarFormActualizacion = false;
        this.cargarActualizaciones(this.gatoEditando.id);
      },
      error: (err) => {
        console.error(err);
        this.errorActualizacion = 'No se pudo publicar la actualización.';
        this.cdr.markForCheck();
      }
    });
  }

  borrarActualizacion(act: ActualizacionGato) {
    if (!act.id) return;
    if (!confirm(`¿Eliminar "${act.titulo}"?`)) return;
    this.actualizacionService.borrar(act.id).subscribe({
      next: () => this.cargarActualizaciones(this.gatoEditando.id),
      error: (err) => console.error(err)
    });
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
    this.actualizacionesGato = [];
    this.mostrarFormActualizacion = false;
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
