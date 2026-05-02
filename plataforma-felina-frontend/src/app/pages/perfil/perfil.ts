import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService, Insignias } from '../../services/usuario';
import { GatoService } from '../../services/gato';
import { SolicitudService } from '../../services/solicitud';
import { DonacionService, Donacion } from '../../services/donacion';
import { ApadrinamientoService, Apadrinamiento, PagoApadrinamiento } from '../../services/apadrinamiento';
import { FavoritoService } from '../../services/favorito';
import { ActualizacionGatoService, ActualizacionGato } from '../../services/actualizacion-gato';
import { Gato } from '../../services/gato';
import { TarjetaInsigniaComponent } from '../../components/tarjeta-insignia/tarjeta-insignia';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

interface InsigniaDef {
  clave: keyof Insignias;
  titulo: string;
  descripcion: string;
  imagen: string;
}

interface PortadaDef {
  clave: string;
  tipo: 'color' | 'imagen';
  etiqueta: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TarjetaInsigniaComponent],
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
  favoritoService = inject(FavoritoService);
  actualizacionService = inject(ActualizacionGatoService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  fotosGatos: string[] = [];
  avatarSeleccionadoUrl: string | null = null;
  mostrarModal: boolean = false;

  solicitudesUsuario: any[] = [];
  donaciones: Donacion[] = [];
  apadrinamientos: Apadrinamiento[] = [];
  pagosApadrinamiento: PagoApadrinamiento[] = [];

  seccionesAbiertas = new Set<string>(['solicitudes']);

  mostrarModalPortada = false;
  readonly portadasCatalogo: PortadaDef[] = [
    { clave: 'morado',   tipo: 'color',  etiqueta: 'Morado'   },
    { clave: 'crema',    tipo: 'color',  etiqueta: 'Crema'    },
    { clave: 'amanecer', tipo: 'imagen', etiqueta: 'Amanecer' },
    { clave: 'lavanda',  tipo: 'imagen', etiqueta: 'Lavanda'  },
    { clave: 'bosque',   tipo: 'imagen', etiqueta: 'Bosque'   }
  ];

  apadrinamientoEditando: Apadrinamiento | null = null;
  nuevoImporte: number | null = null;
  guardandoImporte = false;
  errorImporte: string | null = null;

  insigniaSeleccionada: InsigniaDef | null = null;

  favoritos: Gato[] = [];
  feedNovedades: ActualizacionGato[] = [];

  mostrarEditarPerfil = false;
  perfilEdit: { nombre: string; apellido: string; telefono: string; codigoPostal: string } = {
    nombre: '', apellido: '', telefono: '', codigoPostal: ''
  };
  guardandoPerfil = false;
  errorPerfil: string | null = null;

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
    this.cargarFavoritos();
    this.cargarFeedNovedades();
  }

  cargarFeedNovedades() {
    const user = this.authService.user();
    if (!user) return;
    this.actualizacionService.getFeed(user.id).subscribe({
      next: (data) => {
        this.feedNovedades = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando feed', err)
    });
  }

  cargarFavoritos() {
    const user = this.authService.user();
    if (!user) return;
    this.favoritoService.cargarIds(user.id).subscribe({
      next: (gatos) => {
        this.favoritos = gatos;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando favoritos', err)
    });
  }

  quitarFavorito(g: Gato) {
    const user = this.authService.user();
    if (!user) return;
    this.favoritoService.quitar(user.id, g.id).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(x => x.id !== g.id);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error quitando favorito', err)
    });
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

  abrirTarjetaInsignia(ins: InsigniaDef) {
    if (!this.desbloqueada(ins.clave)) return;
    this.insigniaSeleccionada = ins;
  }

  cerrarTarjetaInsignia() {
    this.insigniaSeleccionada = null;
  }

  cargarSolicitudes() {
    const user = this.authService.user();
    if (!user) return;
    this.solicitudService.getAll().subscribe({
      next: (data: any[]) => {
        this.solicitudesUsuario = data.filter(s => s?.id?.usuarioId === user.id);
        if (this.solicitudesPendientes.length === 0 && this.familiaFelina.length > 0) {
          this.seccionesAbiertas.delete('solicitudes');
          this.seccionesAbiertas.add('familia');
        }
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

  abrirEditarPerfil() {
    const u = this.authService.user();
    if (!u) return;
    this.perfilEdit = {
      nombre: u.nombre || '',
      apellido: u.apellido || '',
      telefono: u.telefono || '',
      codigoPostal: u.codigoPostal || ''
    };
    this.errorPerfil = null;
    this.mostrarEditarPerfil = true;
  }

  cerrarEditarPerfil() {
    this.mostrarEditarPerfil = false;
    this.errorPerfil = null;
  }

  guardarPerfil() {
    const u = this.authService.user();
    if (!u) return;
    if (this.perfilEdit.codigoPostal && !/^\d{5}$/.test(this.perfilEdit.codigoPostal)) {
      this.errorPerfil = 'El código postal debe tener 5 dígitos.';
      return;
    }
    this.guardandoPerfil = true;
    this.errorPerfil = null;
    this.usuarioService.actualizarPerfil(u.id, this.perfilEdit).subscribe({
      next: (actualizado) => {
        const usuarioMerged = { ...u, ...actualizado };
        this.authService.setSession({ usuario: usuarioMerged, token: this.authService.getToken() });
        this.guardandoPerfil = false;
        this.mostrarEditarPerfil = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorPerfil = 'No se pudo actualizar el perfil.';
        this.guardandoPerfil = false;
        this.cdr.markForCheck();
      }
    });
  }

  abrirEditorImporte(a: Apadrinamiento) {
    this.apadrinamientoEditando = a;
    this.nuevoImporte = a.importeMensual;
    this.errorImporte = null;
  }

  cerrarEditorImporte() {
    this.apadrinamientoEditando = null;
    this.nuevoImporte = null;
    this.errorImporte = null;
  }

  guardarNuevoImporte() {
    if (!this.apadrinamientoEditando?.id) return;
    if (this.nuevoImporte == null || this.nuevoImporte < 1) {
      this.errorImporte = 'El importe mínimo es 1 €.';
      return;
    }
    if (this.nuevoImporte === this.apadrinamientoEditando.importeMensual) {
      this.cerrarEditorImporte();
      return;
    }
    this.guardandoImporte = true;
    this.errorImporte = null;
    this.apadrinamientoService.actualizarImporte(this.apadrinamientoEditando.id, this.nuevoImporte).subscribe({
      next: (actualizado) => {
        const idx = this.apadrinamientos.findIndex(x => x.id === actualizado.id);
        if (idx >= 0) this.apadrinamientos[idx] = actualizado;
        this.guardandoImporte = false;
        this.cerrarEditorImporte();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorImporte = 'No se pudo actualizar el importe.';
        this.guardandoImporte = false;
        this.cdr.markForCheck();
      }
    });
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
        this.cdr.markForCheck();
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

  toggleSeccion(clave: string) {
    if (this.seccionesAbiertas.has(clave)) {
      this.seccionesAbiertas.delete(clave);
    } else {
      this.seccionesAbiertas.add(clave);
    }
  }

  estaAbierta(clave: string): boolean {
    return this.seccionesAbiertas.has(clave);
  }

  get portadaActual(): string {
    return this.authService.user()?.portada || 'morado';
  }

  abrirModalPortada() {
    this.mostrarModalPortada = true;
  }

  cerrarModalPortada() {
    this.mostrarModalPortada = false;
  }

  seleccionarPortada(clave: string) {
    const u = this.authService.user();
    if (!u) return;
    this.usuarioService.actualizarPerfil(u.id, { portada: clave }).subscribe({
      next: (actualizado) => {
        const usuarioMerged = { ...u, ...actualizado };
        this.authService.setSession({ usuario: usuarioMerged, token: this.authService.getToken() });
        this.mostrarModalPortada = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error guardando portada', err);
        alert('No se pudo guardar la portada.');
      }
    });
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
