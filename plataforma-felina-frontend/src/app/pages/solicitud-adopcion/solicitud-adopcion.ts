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
  tipoSolicitud: 'ADOPCION' | 'APADRINAMIENTO' = 'ADOPCION';

  datos = {
    experienciaPrevia: '',
    motivoAdopcion: '',
    condicionesVivienda: ''
  };

  get esApadrinamiento(): boolean {
    return this.tipoSolicitud === 'APADRINAMIENTO';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('gatoId');
    if (id) {
      this.gatoService.getGatoById(id).subscribe({
        next: (data) => {
          this.gato = data;
          this.tipoSolicitud = data?.estado === 'APADRINABLE' ? 'APADRINAMIENTO' : 'ADOPCION';
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
