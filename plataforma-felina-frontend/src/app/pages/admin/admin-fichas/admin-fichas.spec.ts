import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGatos } from './admin-fichas';

describe('AdminGatos', () => {
  let component: AdminGatos;
  let fixture: ComponentFixture<AdminGatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGatos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
