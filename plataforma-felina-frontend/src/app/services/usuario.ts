import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  telefono: string;
  codigoPostal?: string;
  fotoUrl?: string;
  id_rol? : number;
  rol?: Rol;
}

export interface Tarea {
  id: number;
  descripcion: string;
  estado: string;
  titulo: string;
  urgencia: string;
  tipo?: string;
  codigoPostal?: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Rol {
  id: number;
  nombre: string; //'ADMIN', 'USER'
}

export interface Insignias {
  familia: boolean;
  donante: boolean;
  veterano: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/api/usuarios`;
  private tareasUrl = `${environment.apiUrl}/api/tareas`;

  public usuarioActual: Usuario | null = null;


  constructor(private http: HttpClient) {
    const sesionGuardada = localStorage.getItem('usuario_sesion');
    if (sesionGuardada) {
      this.usuarioActual = JSON.parse(sesionGuardada);
    }
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario);
  }

  login(datos: Login): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, datos);
  }


  logout() {
    this.usuarioActual = null;
    localStorage.removeItem('usuario_sesion');
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateRol(usuarioId: number, rolId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${usuarioId}/rol`, { rolId });
  }

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.tareasUrl);
  }

  actualizarFoto(id: number, url: string): Observable<void> {
    // El backend espera un Map con la clave "fotoUrl" según el Controller que diseñamos
    return this.http.patch<void>(`${this.apiUrl}/${id}/foto`, { fotoUrl: url });
  }

  actualizarPerfil(id: number, datos: Partial<Usuario>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/perfil`, datos);
  }

  getInsignias(id: number): Observable<Insignias> {
    return this.http.get<Insignias>(`${this.apiUrl}/${id}/insignias`);
  }
}
