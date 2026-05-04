import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChatService } from './chat';
import { environment } from '../../environments/environment';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('hace POST a /api/chat con el body de la petición', () => {
    const peticion = {
      usuarioId: 1,
      historia: [{ rol: 'usuario' as const, texto: 'Hola' }],
      mensaje: '¿Qué gato me recomiendas?'
    };

    service.enviar(peticion).subscribe(res => {
      expect(res.respuesta).toBe('Te recomiendo a Misifú');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/chat`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(peticion);
    req.flush({ respuesta: 'Te recomiendo a Misifú' });
  });
});
