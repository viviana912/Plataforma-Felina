import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatoDetalle } from './gato-detalle';

describe('GatoDetalle', () => {
  let component: GatoDetalle;
  let fixture: ComponentFixture<GatoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatoDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
