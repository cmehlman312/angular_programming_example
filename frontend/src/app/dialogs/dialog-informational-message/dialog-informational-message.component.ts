import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-informational-message',
  templateUrl: './dialog-informational-message.component.html',
  styleUrls: ['./dialog-informational-message.component.css'],
})
export class DialogInformationalMessageComponent implements OnInit {
  fromPage: string;
  fromDialog: string;

  constructor(
    public dialogRef: MatDialogRef<DialogInformationalMessageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fromPage = data.pageValue;
  }
  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.fromDialog });
  }
}
