import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInformationalMessageComponent } from './dialog-informational-message.component';

describe('DialogInformationalMessageComponent', () => {
  let component: DialogInformationalMessageComponent;
  let fixture: ComponentFixture<DialogInformationalMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInformationalMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogInformationalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
