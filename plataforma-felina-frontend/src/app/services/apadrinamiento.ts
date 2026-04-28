import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Apadrinamiento {
  id?: number;
  usuario: { id: number };
  gato: { id: number; nombre?: string; fotoUrl?: string; estado?: string };
  importeMensual: number;
  fechaInicio?: string;
  proximoCobro?: string;
  estado?: string;
  tarjetaUltimos4?: string;
}

export interface PagoApadrinamiento {
  id: number;
  apadrinamiento: { id: number };
  importe: number;
  fechaCobro: string;
}

@Injectable({ providedIn: 'root' })
export class ApadrinamientoService {
  private apiBase = `${environment.apiUrl}/api/apadrinamientos`;
  private apiPagos = `${environment.apiUrl}/api/pagos-apadrinamiento`;

  constructor(private http: HttpClient) {}

  crear(a: Apadrinamiento): Observable<Apadrinamiento> {
    return this.http.post<Apadrinamiento>(this.apiBase, a);
  }

  getByUsuario(usuarioId: number): Observable<Apadrinamiento[]> {
    return this.http.get<Apadrinamiento[]>(`${this.apiBase}/usuario/${usuarioId}`);
  }

  cancelar(id: number): Observable<Apadrinamiento> {
    return this.http.put<Apadrinamiento>(`${this.apiBase}/${id}/cancelar`, {});
  }

  procesarCobros(usuarioId: number): Observable<{ cobrosGenerados: number }> {
    return this.http.post<{ cobrosGenerados: number }>(
      `${this.apiBase}/usuario/${usuarioId}/procesar-cobros`,
      {}
    );
  }

  getPagos(usuarioId: number): Observable<PagoApadrinamiento[]> {
    return this.http.get<PagoApadrinamiento[]>(`${this.apiPagos}/usuario/${usuarioId}`);
  }
}
