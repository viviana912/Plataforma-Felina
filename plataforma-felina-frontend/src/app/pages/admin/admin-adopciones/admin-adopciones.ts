import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../../services/solicitud';

@Component({
  selector: 'app-admin-adopciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-adopciones.html',
  styleUrls: ['./admin-adopciones.css']
})
export class AdminAdopcionesComponent implements OnInit {
  private service = inject(SolicitudService);
  private cdr = inject(ChangeDetectorRef);

  solicitudes: any[] = [];
  filtroTipo: 'TODAS' | 'ADOPCION' | 'APADRINAMIENTO' = 'TODAS';

  // Estados para modales
  solicitudParaEditar: any = null;
  nuevoEstadoPendiente: string | null = null;
  solicitudAEliminar: any = null;
  solicitudDetalle: any = null;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.getAll().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.cdr.markForCheck();
      },
      error: (e) => console.error(e)
    });
  }

  get solicitudesFiltradas(): any[] {
    if (this.filtroTipo === 'TODAS') {
      return this.solicitudes;
    }
    return this.solicitudes.filter(s => s.tipoSolicitud === this.filtroTipo);
  }

  // Cambio de estado
  abrirModalCambioEstado(solicitud: any, nuevoEstado: string) {
    this.solicitudParaEditar = solicitud;
    this.nuevoEstadoPendiente = nuevoEstado;
  }

  confirmarCambioEstado() {
    if (this.solicitudParaEditar && this.nuevoEstadoPendiente) {
      const usuarioId = this.solicitudParaEditar.usuario.id;
      const gatoId = this.solicitudParaEditar.gato.id;
      this.service.actualizarEstado(usuarioId, gatoId, this.nuevoEstadoPendiente)
        .subscribe({
          next: () => {
            this.cargar();
            this.cerrarModalEstado();
          },
          error: (err) => console.error('Error al cambiar estado', err)
        });
    }
  }

  cerrarModalEstado() {
    this.solicitudParaEditar = null;
    this.nuevoEstadoPendiente = null;
    this.cargar();
  }

  // Eliminación
  abrirModalEliminar(solicitud: any) {
    this.solicitudAEliminar = solicitud;
  }

  confirmarEliminacion() {
    if (this.solicitudAEliminar) {
      const usuarioId = this.solicitudAEliminar.usuario.id;
      const gatoId = this.solicitudAEliminar.gato.id;
      this.service.delete(usuarioId, gatoId).subscribe({
        next: () => {
          this.cargar();
          this.solicitudAEliminar = null;
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  // Detalle
  abrirModalDetalle(solicitud: any) {
    this.solicitudDetalle = solicitud;
  }

  cerrarModalDetalle() {
    this.solicitudDetalle = null;
  }
}
