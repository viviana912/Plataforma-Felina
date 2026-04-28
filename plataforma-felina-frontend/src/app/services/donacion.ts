import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Donacion {
  id?: number;
  fechaDonacion?: string;
  cantidad: number;
  mensaje?: string;
  tarjetaUltimos4?: string;
  anonima?: boolean;
  usuario?: { id: number } | null;
}

@Injectable({ providedIn: 'root' })
export class DonacionService {
  private apiUrl = `${environment.apiUrl}/api/donaciones`;

  constructor(private http: HttpClient) {}

  crear(d: Donacion): Observable<Donacion> {
    return this.http.post<Donacion>(this.apiUrl, d);
  }

  getByUsuario(usuarioId: number): Observable<Donacion[]> {
    return this.http.get<Donacion[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}
