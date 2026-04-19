import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FichaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/gatos';

  getGatos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveGato(gato: any): Observable<any> {
    if (gato.id) {
      return this.http.put<any>(`${this.apiUrl}/${gato.id}`, gato);
    }
    return this.http.post<any>(this.apiUrl, gato);
  }

  deleteGato(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
