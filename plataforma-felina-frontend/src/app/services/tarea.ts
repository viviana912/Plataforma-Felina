import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/tareas`;
  private apiSolicitud = `${environment.apiUrl}/api/solicitudes-tarea`;

  getTareas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTarea(tarea: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tarea);
  }

  updateTarea(id: number, tarea: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tarea);
  }

  deleteTarea(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  inscribirseEnTarea(usuarioId: number, tareaId: number): Observable<any> {
    return this.http.post<any>(this.apiSolicitud, {
      id: { usuarioId, tareaId },
      usuario: { id: usuarioId },
      tarea: { id: tareaId },
      estadoSolicitud: 'PENDIENTE'
    });
  }

  /** Inscritos de una tarea concreta (uso del panel de admin). */
  getInscritosDeTarea(tareaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiSolicitud}/tarea/${tareaId}`);
  }

  /** Tareas en las que se ha inscrito un usuario (uso del perfil). */
  getInscripcionesDeUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiSolicitud}/usuario/${usuarioId}`);
  }
}
