import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubmitToMeetingComponent } from './dialog-submit-to-meeting.component';

describe('DialogSubmitToMeetingComponent', () => {
  let component: DialogSubmitToMeetingComponent;
  let fixture: ComponentFixture<DialogSubmitToMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSubmitToMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSubmitToMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
