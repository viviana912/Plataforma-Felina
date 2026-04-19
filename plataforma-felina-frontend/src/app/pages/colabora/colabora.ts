import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Tarea, UsuarioService } from '../../services/usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-colabora',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './colabora.html',
  styleUrls: ['./colabora.css']
})
export class ColaboraComponent implements OnInit {
  usuarioService = inject(UsuarioService);
  authService = inject(AuthService);

  tareasOriginales: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  filtroSeleccionado: string = 'Todas';

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.usuarioService.getTareas().subscribe({
      next: (datos) => {
        this.tareasOriginales = datos;
        this.tareasFiltradas = datos;
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }

  filtrar() {
    if (this.filtroSeleccionado === 'Todas') {
      this.tareasFiltradas = this.tareasOriginales;
    } else {
      this.tareasFiltradas = this.tareasOriginales.filter(
        t => t.urgencia === this.filtroSeleccionado
      );
    }
  }

  postular(tarea: Tarea) {
    // Usamos authService para sacar el nombre del usuario logueado
    const nombreUsuario = this.authService.user()?.nombre;
    alert(`¡Gracias ${nombreUsuario}! Te has postulado para: ${tarea.titulo}. Nos pondremos en contacto contigo pronto.`);
  }
}
