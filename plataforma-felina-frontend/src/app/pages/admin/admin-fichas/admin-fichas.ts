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
      fotoUrl: ''
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
}
