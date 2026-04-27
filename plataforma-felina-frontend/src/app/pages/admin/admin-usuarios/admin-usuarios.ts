import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario';
import { FormsModule}  from '@angular/forms';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrls: ['./admin-usuarios.css']
})
export class AdminUsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);
  usuarios: any[] = [];

  usuarioAEliminar: any = null;
  usuarioParaEditarRol: any = null;
  nuevoRolPendiente: number | null = null;

  trackById = (_: number, u: any) => u.id;

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  // ELIMINAR
  abrirModalEliminar(usuario: any) {
    this.usuarioAEliminar = usuario;
  }

  confirmarEliminacion() {
    if (this.usuarioAEliminar) {
      this.usuarioService.eliminarUsuario(this.usuarioAEliminar.id).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.usuarioAEliminar = null;
        },
        error: (err) => console.error(err)
      });
    }
  }

  // CAMBIAR ROL
  abrirModalRol(usuario: any, nuevoRolId: number) {

    this.usuarioParaEditarRol = usuario;
    this.nuevoRolPendiente = nuevoRolId;
  }

  confirmarCambioRol() {
    if (this.usuarioParaEditarRol && this.nuevoRolPendiente) {
      this.usuarioService.updateRol(this.usuarioParaEditarRol.id, this.nuevoRolPendiente).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModalRol();
        },
        error: (err) => console.error(err)
      });
    }
  }

  cerrarModalRol() {
    this.usuarioParaEditarRol = null;
    this.nuevoRolPendiente = null;
    this.cargarUsuarios();
  }
}
