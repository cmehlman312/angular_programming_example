import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRejectedMessageComponent } from './dialog-rejected-message.component';

describe('DialogReviewRejectedComponent', () => {
  let component: DialogRejectedMessageComponent;
  let fixture: ComponentFixture<DialogRejectedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogRejectedMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogRejectedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
