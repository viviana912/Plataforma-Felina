import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioService, Insignias } from '../../services/usuario';
import { GatoService } from '../../services/gato';
import { SolicitudService } from '../../services/solicitud';
import { Router } from '@angular/router';

type TabPerfil = 'solicitudes' | 'familia';

interface InsigniaDef {
  clave: keyof Insignias;
  titulo: string;
  descripcion: string;
  imagen: string;
}

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
  solicitudService = inject(SolicitudService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  fotosGatos: string[] = [];
  avatarSeleccionadoUrl: string | null = null;
  mostrarModal: boolean = false; // 👈 Control del modal

  solicitudesUsuario: any[] = [];
  activeTab: TabPerfil = 'solicitudes';

  insignias: Insignias = { familia: false, donante: false, veterano: false };
  readonly insigniasCatalogo: InsigniaDef[] = [
    { clave: 'familia',  titulo: 'Familia',  descripcion: 'Has adoptado, acogido o apadrinado a un gato.', imagen: 'assets/insignias/familia.jpg' },
    { clave: 'donante',  titulo: 'Donante',  descripcion: 'Has realizado al menos una donación.',          imagen: 'assets/insignias/donante.jpg' },
    { clave: 'veterano', titulo: 'Veterano', descripcion: 'Llevas más de un año con nosotros.',           imagen: 'assets/insignias/veterano.jpg' }
  ];

  ngOnInit() {
    this.cargarAvataresDisponibles();
    this.cargarSolicitudes();
    this.cargarInsignias();
    this.avatarSeleccionadoUrl = this.authService.user()?.fotoUrl || null;
  }

  cargarInsignias() {
    const user = this.authService.user();
    if (!user) return;
    this.usuarioService.getInsignias(user.id).subscribe({
      next: (data) => {
        this.insignias = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando insignias', err)
    });
  }

  desbloqueada(clave: keyof Insignias): boolean {
    return !!this.insignias[clave];
  }

  cargarSolicitudes() {
    const user = this.authService.user();
    if (!user) return;
    this.solicitudService.getAll().subscribe({
      next: (data: any[]) => {
        this.solicitudesUsuario = data.filter(s => s?.id?.usuarioId === user.id);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando solicitudes', err)
    });
  }

  get solicitudesPendientes(): any[] {
    return this.solicitudesUsuario.filter(s => (s.estado || '').toUpperCase() !== 'APROBADA');
  }

  get familiaFelina(): any[] {
    return this.solicitudesUsuario.filter(s => (s.estado || '').toUpperCase() === 'APROBADA');
  }

  etiquetaTipo(tipo: string | null | undefined): string {
    switch ((tipo || '').toUpperCase()) {
      case 'ADOPCION': return 'Adoptado';
      case 'ACOGIDA': return 'En acogida';
      case 'APADRINAMIENTO': return 'Apadrinado';
      default: return 'Miembro';
    }
  }

  seleccionarTab(tab: TabPerfil) {
    this.activeTab = tab;
  }

  cargarAvataresDisponibles() {
    this.gatoService.getGatos().subscribe({
      next: (gatos) => {
        this.fotosGatos = gatos.map(g => g.fotoUrl);
        this.cdr.markForCheck();
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
