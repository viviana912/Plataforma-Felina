import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudColaboradorService } from '../../../services/solicitud-colaborador';

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-solicitudes.html',
  styleUrls: ['./admin-solicitudes.css']
})
export class AdminSolicitudesComponent implements OnInit {
  private service = inject(SolicitudColaboradorService);

  solicitudes: any[] = [];

  // Estados para modales
  solicitudParaEditar: any = null;
  nuevoEstadoPendiente: string | null = null;
  solicitudAEliminar: any = null;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.getAll().subscribe({
      next: (data) => this.solicitudes = data,
      error: (e) => console.error(e)
    });
  }

  // Lógica de cambio de estado con Modal
  abrirModalCambioEstado(solicitud: any, nuevoEstado: string) {
    this.solicitudParaEditar = solicitud;
    this.nuevoEstadoPendiente = nuevoEstado;
  }

  confirmarCambioEstado() {
    if (this.solicitudParaEditar && this.nuevoEstadoPendiente) {
      this.service.actualizarEstado(this.solicitudParaEditar.usuario.id, this.nuevoEstadoPendiente)
        .subscribe({
          next: () => {
            this.cargar(); // Recarga la tabla para ver el rol actualizado
            this.cerrarModalEstado();
          },
          error: (err) => console.error("Error al cambiar estado", err)
        });
    }
  }

  cerrarModalEstado() {
    this.solicitudParaEditar = null;
    this.nuevoEstadoPendiente = null;
    this.cargar(); // Refrescamos para asegurar que el select vuelva a su sitio si se canceló
  }

  // Lógica de eliminación con Modal
  abrirModalEliminar(solicitud: any) {
    this.solicitudAEliminar = solicitud;
  }

  confirmarEliminacion() {
    if (this.solicitudAEliminar) {
      this.service.delete(this.solicitudAEliminar.usuario.id).subscribe({
        next: () => {
          this.cargar();
          this.solicitudAEliminar = null;
        }
      });
    }
  }
}
