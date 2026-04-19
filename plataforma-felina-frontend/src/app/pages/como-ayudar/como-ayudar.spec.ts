import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoAyudar } from './como-ayudar';

describe('ComoAyudar', () => {
  let component: ComoAyudar;
  let fixture: ComponentFixture<ComoAyudar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComoAyudar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComoAyudar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
