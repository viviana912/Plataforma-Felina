import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tareas'; // Asegúrate de que este es tu puerto

  getTareas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTarea(tarea: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tarea);
  }

  deleteTarea(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
