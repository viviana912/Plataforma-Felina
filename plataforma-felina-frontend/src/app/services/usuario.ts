import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  telefono: string;
  id_rol? : number;
  rol?: Rol;
}

export interface Tarea {
  id: number;
  descripcion: string;
  estado: string;
  titulo: string;
  urgencia: string;

}

export interface Login {
  email: string;
  password: string;
}

export interface Rol {
  id: number;
  nombre: string; //'ADMIN', 'USER'
}


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private tareasUrl = 'http://localhost:8080/api/tareas';

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
}
