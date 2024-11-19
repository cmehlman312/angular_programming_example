import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReviseMessageComponent } from './dialog-revise-message.component';

describe('DialogReviseMessageComponent', () => {
  let component: DialogReviseMessageComponent;
  let fixture: ComponentFixture<DialogReviseMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogReviseMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogReviseMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
