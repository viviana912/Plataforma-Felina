import { TestBed } from '@angular/core/testing';

import { SolicitudColaborador } from './solicitud-colaborador';

describe('SolicitudColaborador', () => {
  let service: SolicitudColaborador;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudColaborador);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
