import {
  Component,
  OnInit,
  Optional,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Subject } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TherapyplansService } from '../../services/therapyplans.service';

@Component({
  selector: 'dialog-submit-to-meeting',
  templateUrl: './dialog-submit-to-meeting.component.html',
  styleUrls: ['./dialog-submit-to-meeting.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogSubmitToMeetingComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  fromDialog: string = '';
  meetingDate: any;
  futuremeetingdates: [];
  currentmeetingdate: '';

  weekendFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  dateClass = (cellDate: any, view: string) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      let tempDate = this.datePipe.transform(cellDate, 'MM-dd-yyyy');

      let foundDate = false;
      for (const dated of this.futuremeetingdates) {
        if (tempDate === dated) foundDate = true;
      }
      return foundDate ? 'future-meeting-dates' : '';
    }

    return '';
  };

  selected: Date | null;

  constructor(
    private datePipe: DatePipe,
    private therapyplansService: TherapyplansService,
    public dialogRef: MatDialogRef<DialogSubmitToMeetingComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.futuremeetingdates = data.futuremeetingdates;
    this.currentmeetingdate = data.currentmeetingdate;
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close({ event: 'close' });
  }

  okDialog(): void {
    // this.meetingDate = this.datePipe.transform(this.fromDialog, 'MM-dd-yyyy');
    this.dialogRef.close({ event: 'save', data: this.meetingDate });
  }

  onSelect(event: any) {
    this.meetingDate = event;
  }
}
