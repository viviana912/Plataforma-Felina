import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FichaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/gatos`;

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

  uploadFoto(file: File): Observable<{ url: string; fullUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; fullUrl: string }>(
      `${environment.apiUrl}/api/uploads`,
      formData
    );
  }
}
