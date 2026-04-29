import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Gato } from './gato';

@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private apiBase = `${environment.apiUrl}/api/favoritos`;
  private http = inject(HttpClient);

  private idsFavoritosSubject = new BehaviorSubject<Set<number>>(new Set());
  idsFavoritos$ = this.idsFavoritosSubject.asObservable();

  cargarIds(usuarioId: number): Observable<Gato[]> {
    return this.listar(usuarioId).pipe(
      tap((gatos) => {
        const ids = new Set<number>(gatos.map((g) => g.id));
        this.idsFavoritosSubject.next(ids);
      })
    );
  }

  listar(usuarioId: number): Observable<Gato[]> {
    return this.http.get<Gato[]>(`${this.apiBase}/usuario/${usuarioId}`);
  }

  agregar(usuarioId: number, gatoId: number): Observable<unknown> {
    return this.http.post(`${this.apiBase}`, { usuarioId, gatoId }).pipe(
      tap(() => {
        const next = new Set(this.idsFavoritosSubject.value);
        next.add(gatoId);
        this.idsFavoritosSubject.next(next);
      })
    );
  }

  quitar(usuarioId: number, gatoId: number): Observable<unknown> {
    return this.http.delete(`${this.apiBase}/usuario/${usuarioId}/gato/${gatoId}`).pipe(
      tap(() => {
        const next = new Set(this.idsFavoritosSubject.value);
        next.delete(gatoId);
        this.idsFavoritosSubject.next(next);
      })
    );
  }

  esFavorito(gatoId: number): boolean {
    return this.idsFavoritosSubject.value.has(gatoId);
  }

  limpiar() {
    this.idsFavoritosSubject.next(new Set());
  }
}
