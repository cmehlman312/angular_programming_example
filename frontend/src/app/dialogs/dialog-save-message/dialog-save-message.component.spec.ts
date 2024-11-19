import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSaveMessageComponent } from './dialog-save-message.component';

describe('DialogSaveMessageComponent', () => {
  let component: DialogSaveMessageComponent;
  let fixture: ComponentFixture<DialogSaveMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogSaveMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogSaveMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
