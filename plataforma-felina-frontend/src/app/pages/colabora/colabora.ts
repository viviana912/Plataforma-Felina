import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Tarea, UsuarioService } from '../../services/usuario';
import { TareaService } from '../../services/tarea';
import { AuthService } from '../../services/auth.service';
import { RevealDirective } from '../../directives/reveal.directive';

type TipoTarea = 'TODAS' | 'VOLUNTARIADO' | 'MATERIAL' | 'EVENTO';
type Cercania = 'municipio' | 'provincia' | 'lejos';

interface TareaConCercania extends Tarea {
  cercania: Cercania;
}

@Component({
  selector: 'app-colabora',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RevealDirective],
  templateUrl: './colabora.html',
  styleUrls: ['./colabora.css']
})
export class ColaboraComponent implements OnInit {
  usuarioService = inject(UsuarioService);
  tareaService = inject(TareaService);
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  tareasOriginales: Tarea[] = [];
  filtroUrgencia: string = 'Todas';
  filtroTipo: TipoTarea = 'TODAS';

  inscritas = new Set<number>();

  // Notificación visible al inscribirse o al fallar la inscripción
  notificacion: { tipo: 'exito' | 'error'; mensaje: string } | null = null;
  private notificacionTimeout: any = null;

  ngOnInit() {
    this.cargarTareas();
    this.cargarInscripcionesPrevias();
  }

  private cargarInscripcionesPrevias() {
    const user = this.authService.user();
    if (!user) return;
    this.tareaService.getInscripcionesDeUsuario(user.id).subscribe({
      next: (lista) => {
        lista.forEach(s => {
          if (s?.tarea?.id) this.inscritas.add(s.tarea.id);
          else if (s?.id?.tareaId) this.inscritas.add(s.id.tareaId);
        });
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando inscripciones previas:', err)
    });
  }

  cargarTareas() {
    this.usuarioService.getTareas().subscribe({
      next: (datos) => {
        this.tareasOriginales = datos;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }

  get cpUsuario(): string | undefined {
    return this.authService.user()?.codigoPostal;
  }

  private cercaniaDe(cp: string | undefined): Cercania {
    const usuario = this.cpUsuario;
    if (!usuario || !cp) return 'lejos';
    if (cp === usuario) return 'municipio';
    if (cp.substring(0, 2) === usuario.substring(0, 2)) return 'provincia';
    return 'lejos';
  }

  get tareasFiltradas(): TareaConCercania[] {
    const orden: Record<Cercania, number> = { municipio: 0, provincia: 1, lejos: 2 };
    return this.tareasOriginales
      .filter((t) => this.filtroUrgencia === 'Todas' || t.urgencia === this.filtroUrgencia)
      .filter((t) => this.filtroTipo === 'TODAS' || (t.tipo || 'VOLUNTARIADO') === this.filtroTipo)
      .map((t) => ({ ...t, cercania: this.cercaniaDe(t.codigoPostal) } as TareaConCercania))
      .sort((a, b) => orden[a.cercania] - orden[b.cercania]);
  }

  textoBoton(tipo: string | undefined): string {
    switch (tipo) {
      case 'MATERIAL': return 'Voy a aportar';
      case 'EVENTO': return 'Me apunto';
      default: return 'Yo me encargo';
    }
  }

  iconoTipo(tipo: string | undefined): string {
    switch (tipo) {
      case 'MATERIAL': return 'fa-box-heart';
      case 'EVENTO': return 'fa-calendar-day';
      default: return 'fa-hands-holding';
    }
  }

  etiquetaTipo(tipo: string | undefined): string {
    switch (tipo) {
      case 'MATERIAL': return 'Material';
      case 'EVENTO': return 'Evento';
      default: return 'Voluntariado';
    }
  }

  badgeCercania(c: Cercania): string {
    if (c === 'municipio') return 'En tu municipio';
    if (c === 'provincia') return 'Tu provincia';
    return '';
  }

  postular(tarea: Tarea) {
    const user = this.authService.user();
    if (!user) return;
    if (this.inscritas.has(tarea.id)) return;
    this.tareaService.inscribirseEnTarea(user.id, tarea.id).subscribe({
      next: () => {
        this.inscritas.add(tarea.id);
        this.mostrarNotificacion(
          'exito',
          'Te has inscrito correctamente. La asociación se pondrá en contacto contigo para coordinar los detalles.'
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al postular', err);
        this.mostrarNotificacion(
          'error',
          'No se pudo enviar tu inscripción. Inténtalo de nuevo en unos minutos.'
        );
      }
    });
  }

  estaInscrito(id: number): boolean {
    return this.inscritas.has(id);
  }

  private mostrarNotificacion(tipo: 'exito' | 'error', mensaje: string) {
    this.notificacion = { tipo, mensaje };
    this.cdr.markForCheck();
    if (this.notificacionTimeout) clearTimeout(this.notificacionTimeout);
    this.notificacionTimeout = setTimeout(() => {
      this.notificacion = null;
      this.cdr.markForCheck();
    }, 5000);
  }

  cerrarNotificacion() {
    this.notificacion = null;
    if (this.notificacionTimeout) clearTimeout(this.notificacionTimeout);
  }
}
