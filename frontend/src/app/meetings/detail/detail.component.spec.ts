import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingdetailComponent } from './detail.component';

describe('MeetingdetailComponent', () => {
  let component: MeetingdetailComponent;
  let fixture: ComponentFixture<MeetingdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingdetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
