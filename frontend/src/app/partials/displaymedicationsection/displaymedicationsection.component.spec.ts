import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaymedicationsectionComponent } from './displaymedicationsection.component';

describe('DisplaymedicationsectionComponent', () => {
  let component: DisplaymedicationsectionComponent;
  let fixture: ComponentFixture<DisplaymedicationsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaymedicationsectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaymedicationsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
