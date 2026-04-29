import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';



export interface Gato {
  edad: number;
  id: number;
  nombre: string;
  sexo: string;
  fechaNacimiento: string;
  raza: string;
  color: string;
  vacunas: string;
  caracter: string;
  notas: string;
  estado: string | null;
  urgente: boolean; //
  fotoUrl: string;
  vacunado?: boolean;
  castrado?: boolean;
  desparasitado?: boolean;
  microchip?: boolean;
  aptoNinos?: boolean;
  aptoOtrosGatos?: boolean;
  aptoPerros?: boolean;
}

@Injectable({ providedIn: 'root' })
export class GatoService {
  private apiUrl = `${environment.apiUrl}/api/gatos`;

  constructor(private http: HttpClient) {}

  getGatos(): Observable<Gato[]> {
    return this.http.get<Gato[]>(this.apiUrl);
  }

  getGatosDisponibles(): Observable<Gato[]> {
    return this.http.get<Gato[]>(`${this.apiUrl}/disponibles`);
  }

  getGatoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getGatosAdoptados(): Observable<Gato[]> {
    return this.http.get<Gato[]>(`${this.apiUrl}/adoptados`);
  }
}
