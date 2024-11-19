import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLockedStatusMessageComponent } from './dialog-locked-status-message.component';

describe('DialogLockedStatusMessageComponent', () => {
  let component: DialogLockedStatusMessageComponent;
  let fixture: ComponentFixture<DialogLockedStatusMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLockedStatusMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogLockedStatusMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
