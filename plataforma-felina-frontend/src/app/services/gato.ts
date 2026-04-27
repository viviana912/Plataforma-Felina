import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';



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
}

@Injectable({ providedIn: 'root' })
export class GatoService {
  private apiUrl = 'http://localhost:8080/api/gatos';

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
