import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationsectionComponent } from './medicationsection.component';

describe('MedicationsectionComponent', () => {
  let component: MedicationsectionComponent;
  let fixture: ComponentFixture<MedicationsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicationsectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
