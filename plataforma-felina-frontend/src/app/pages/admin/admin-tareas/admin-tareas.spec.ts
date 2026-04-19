import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTareas } from './admin-tareas';

describe('AdminTareas', () => {
  let component: AdminTareas;
  let fixture: ComponentFixture<AdminTareas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTareas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTareas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
