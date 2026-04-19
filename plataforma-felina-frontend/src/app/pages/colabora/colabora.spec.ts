import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Colabora } from './colabora';

describe('Colabora', () => {
  let component: Colabora;
  let fixture: ComponentFixture<Colabora>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Colabora]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Colabora);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
