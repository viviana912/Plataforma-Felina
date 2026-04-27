import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Solicitud {
  id: {
    usuarioId: number;
    gatoId: number;
  };
  tipoSolicitud: string;
  estado: string;
  experienciaPrevia: string;
  motivoAdopcion: string;
  condicionesVivienda: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/solicitudes`;

  getAll(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  save(solicitud: Solicitud): Observable<any> {
    return this.http.post<any>(this.apiUrl, solicitud);
  }

  actualizarEstado(usuarioId: number, gatoId: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${usuarioId}/${gatoId}/estado`, nuevoEstado);
  }

  delete(usuarioId: number, gatoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${usuarioId}/${gatoId}`);
  }
}
