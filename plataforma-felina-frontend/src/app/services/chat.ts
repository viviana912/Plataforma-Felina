import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MensajeChat {
  rol: 'usuario' | 'asistente';
  texto: string;
}

export interface PeticionChat {
  usuarioId?: number;
  historia: MensajeChat[];
  mensaje: string;
}

export interface RespuestaChat {
  respuesta: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/chat`;

  enviar(peticion: PeticionChat): Observable<RespuestaChat> {
    return this.http.post<RespuestaChat>(this.apiUrl, peticion);
  }
}
