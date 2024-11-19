import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmation-message',
  templateUrl: './dialog-confirmation-message.component.html',
  styleUrls: ['./dialog-confirmation-message.component.css'],
})
export class DialogConfirmationMessageComponent implements OnInit {
  fromPage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationMessageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fromPage = data.messageForDialog;
  }
  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({ event: 'save' });
  }

  cancelDialog() {
    this.dialogRef.close({ event: 'cancel' });
  }
}
