import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudColaboradorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/solicitudes-colaborador'; // Ajusta según tu Controller

  // Obtener todas las solicitudes para la tabla del admin
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener una sola (por si quieres ver detalles)
  getOne(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${usuarioId}`);
  }

  // Crear una nueva solicitud (la que enviaría el usuario normal)
  save(solicitud: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, solicitud);
  }

  // El método estrella: Aprobar (cambia estado y rol en el back)
  aprobarSolicitud(usuarioId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${usuarioId}/aprobar`, {});
  }

  // Borrar/Rechazar solicitud
  delete(usuarioId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${usuarioId}`);
  }

  actualizarEstado(usuarioId: number, nuevoEstado: string): Observable<any> {
    // Enviamos el string directamente al backend
    return this.http.put(`${this.apiUrl}/${usuarioId}/estado`, nuevoEstado);
  }
}
