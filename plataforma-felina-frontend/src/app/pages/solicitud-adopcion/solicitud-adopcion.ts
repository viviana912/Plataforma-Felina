import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GatoService } from '../../services/gato';
import { SolicitudService, Solicitud } from '../../services/solicitud';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-solicitud-adopcion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './solicitud-adopcion.html',
  styleUrls: ['../login/login.css', './solicitud-adopcion.css']
})
export class SolicitudAdopcionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gatoService = inject(GatoService);
  private solicitudService = inject(SolicitudService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  gato: any = null;
  errorMsg = '';
  enviando = false;
  tipoSolicitud: 'ADOPCION' | 'APADRINAMIENTO' | 'ACOGIDA' = 'ADOPCION';

  datos = {
    experienciaPrevia: '',
    motivoAdopcion: '',
    condicionesVivienda: ''
  };

  get esApadrinamiento(): boolean {
    return this.tipoSolicitud === 'APADRINAMIENTO';
  }

  get esAcogida(): boolean {
    return this.tipoSolicitud === 'ACOGIDA';
  }

  get verbo(): string {
    if (this.tipoSolicitud === 'APADRINAMIENTO') return 'apadrinar';
    if (this.tipoSolicitud === 'ACOGIDA') return 'acoger';
    return 'adoptar';
  }

  get sustantivo(): string {
    if (this.tipoSolicitud === 'APADRINAMIENTO') return 'Apadrinamiento';
    if (this.tipoSolicitud === 'ACOGIDA') return 'Acogida';
    return 'Adopción';
  }

  get encabezadoAccion(): string {
    if (this.tipoSolicitud === 'APADRINAMIENTO') return 'Vas a apadrinar a';
    if (this.tipoSolicitud === 'ACOGIDA') return 'Te ofreces a acoger a';
    return 'Estás adoptando a';
  }

  get textoIntroduccion(): string {
    if (!this.gato) return '';
    if (this.tipoSolicitud === 'APADRINAMIENTO') {
      return `Cuéntanos por qué quieres apadrinar a ${this.gato.nombre} y apoyarle en el refugio`;
    }
    if (this.tipoSolicitud === 'ACOGIDA') {
      return `Cuéntanos por qué quieres acoger temporalmente a ${this.gato.nombre} en tu casa`;
    }
    return `Cuéntanos un poco sobre ti para encontrar el mejor hogar para ${this.gato.nombre}`;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('gatoId');
    const segmento = this.route.snapshot.url[0]?.path;

    if (segmento === 'acoger') {
      this.tipoSolicitud = 'ACOGIDA';
    }

    if (id) {
      this.gatoService.getGatoById(id).subscribe({
        next: (data) => {
          this.gato = data;
          if (segmento !== 'acoger') {
            if (data?.estado === 'APADRINABLE') this.tipoSolicitud = 'APADRINAMIENTO';
            else if (data?.estado === 'ACOGIBLE') this.tipoSolicitud = 'ACOGIDA';
            else this.tipoSolicitud = 'ADOPCION';
          }
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error al cargar el gato:', err)
      });
    }
  }

  enviarSolicitud() {
    const usuarioId = this.authService.user()?.id;

    if (!usuarioId || !this.gato) {
      this.errorMsg = 'No se pudo identificar al usuario o al gato.';
      return;
    }

    const solicitud: Solicitud = {
      id: {
        usuarioId: usuarioId,
        gatoId: this.gato.id
      },
      tipoSolicitud: this.tipoSolicitud,
      estado: 'PENDIENTE',
      experienciaPrevia: this.datos.experienciaPrevia,
      motivoAdopcion: this.datos.motivoAdopcion,
      condicionesVivienda: this.datos.condicionesVivienda
    };

    this.enviando = true;
    this.solicitudService.save(solicitud).subscribe({
      next: () => {
        alert('¡Solicitud enviada con éxito! Revisaremos tu perfil.');
        this.router.navigate(['/mis-solicitudes']);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudo enviar la solicitud. Inténtalo de nuevo.';
        this.enviando = false;
      }
    });
  }
}
