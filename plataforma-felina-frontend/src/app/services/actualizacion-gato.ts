import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ActualizacionGato {
  id?: number;
  gato?: { id: number; nombre?: string; fotoUrl?: string };
  fecha?: string;
  titulo: string;
  mensaje?: string;
  fotoUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ActualizacionGatoService {
  private http = inject(HttpClient);
  private apiBase = `${environment.apiUrl}/api/actualizaciones`;

  getDeGato(gatoId: number): Observable<ActualizacionGato[]> {
    return this.http.get<ActualizacionGato[]>(`${this.apiBase}/gato/${gatoId}`);
  }

  getFeed(usuarioId: number): Observable<ActualizacionGato[]> {
    return this.http.get<ActualizacionGato[]>(`${this.apiBase}/feed/usuario/${usuarioId}`);
  }

  crear(gatoId: number, datos: ActualizacionGato): Observable<ActualizacionGato> {
    return this.http.post<ActualizacionGato>(`${this.apiBase}/gato/${gatoId}`, datos);
  }

  borrar(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiBase}/${id}`);
  }
}
