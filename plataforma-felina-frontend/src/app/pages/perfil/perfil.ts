import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioService, Insignias } from '../../services/usuario';
import { GatoService } from '../../services/gato';
import { SolicitudService } from '../../services/solicitud';
import { DonacionService, Donacion } from '../../services/donacion';
import { ApadrinamientoService, Apadrinamiento, PagoApadrinamiento } from '../../services/apadrinamiento';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

type TabPerfil = 'solicitudes' | 'familia' | 'pagos';

interface InsigniaDef {
  clave: keyof Insignias;
  titulo: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);
  gatoService = inject(GatoService);
  solicitudService = inject(SolicitudService);
  donacionService = inject(DonacionService);
  apadrinamientoService = inject(ApadrinamientoService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  fotosGatos: string[] = [];
  avatarSeleccionadoUrl: string | null = null;
  mostrarModal: boolean = false;

  solicitudesUsuario: any[] = [];
  donaciones: Donacion[] = [];
  apadrinamientos: Apadrinamiento[] = [];
  pagosApadrinamiento: PagoApadrinamiento[] = [];

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
    this.cargarPagosUsuario();
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

  cargarPagosUsuario() {
    const user = this.authService.user();
    if (!user) return;

    this.apadrinamientoService.procesarCobros(user.id).subscribe({
      next: () => {
        forkJoin({
          donaciones: this.donacionService.getByUsuario(user.id),
          apadrinamientos: this.apadrinamientoService.getByUsuario(user.id),
          pagos: this.apadrinamientoService.getPagos(user.id)
        }).subscribe({
          next: ({ donaciones, apadrinamientos, pagos }) => {
            this.donaciones = donaciones;
            this.apadrinamientos = apadrinamientos;
            this.pagosApadrinamiento = pagos;
            this.cdr.markForCheck();
          },
          error: (err) => console.error('Error cargando pagos', err)
        });
      },
      error: (err) => console.error('Error procesando cobros', err)
    });
  }

  get solicitudesPendientes(): any[] {
    return this.solicitudesUsuario.filter(s => (s.estado || '').toUpperCase() !== 'APROBADA');
  }

  get familiaFelina(): any[] {
    return this.solicitudesUsuario.filter(s => (s.estado || '').toUpperCase() === 'APROBADA');
  }

  get apadrinamientosActivos(): Apadrinamiento[] {
    return this.apadrinamientos.filter(a => a.estado === 'ACTIVO');
  }

  pagosDeApadrinamiento(apadrinamientoId: number | undefined): PagoApadrinamiento[] {
    if (!apadrinamientoId) return [];
    return this.pagosApadrinamiento.filter(p => p.apadrinamiento?.id === apadrinamientoId);
  }

  cancelarApadrinamiento(a: Apadrinamiento) {
    if (!a.id) return;
    const ok = confirm(`¿Seguro que quieres cancelar el apadrinamiento de ${a.gato?.nombre || 'este gato'}? No se cobrarán más mensualidades.`);
    if (!ok) return;
    this.apadrinamientoService.cancelar(a.id).subscribe({
      next: (cancelado) => {
        const idx = this.apadrinamientos.findIndex(x => x.id === cancelado.id);
        if (idx >= 0) this.apadrinamientos[idx] = cancelado;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo cancelar el apadrinamiento.');
      }
    });
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
          this.mostrarModal = false;
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
