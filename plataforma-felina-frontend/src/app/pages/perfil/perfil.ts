import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario';
import { GatoService } from '../../services/gato';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);
  gatoService = inject(GatoService);
  router = inject(Router);

  fotosGatos: string[] = [];
  avatarSeleccionadoUrl: string | null = null;
  mostrarModal: boolean = false; // 👈 Control del modal

  ngOnInit() {
    this.cargarAvataresDisponibles();
    this.avatarSeleccionadoUrl = this.authService.user()?.fotoUrl || null;
  }

  cargarAvataresDisponibles() {
    this.gatoService.getGatos().subscribe({
      next: (gatos) => {
        this.fotosGatos = gatos.map(g => g.fotoUrl);
      },
      error: (err) => console.error('Error cargando gatos', err)
    });
  }

  seleccionarAvatar(url: string) {
    const user = this.authService.user();
    if (user) {
      this.avatarSeleccionadoUrl = url;
      this.usuarioService.actualizarFoto(user.id, url).subscribe({
        next: () => {
          const userActualizado = { ...user, fotoUrl: url };
          this.authService.setSession({ usuario: userActualizado, token: this.authService.getToken() });
          this.mostrarModal = false; // 👈 Cerramos el modal al elegir
        },
        error: (err) => {
          console.error('Error al actualizar foto', err);
          this.avatarSeleccionadoUrl = user.fotoUrl;
          alert('No se pudo actualizar el avatar.');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
