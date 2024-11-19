import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-locked-status-message',
  templateUrl: './dialog-locked-status-message.component.html',
  styleUrls: ['./dialog-locked-status-message.component.css'],
})
export class DialogLockedStatusMessageComponent implements OnInit {
  lockInformation: any;
  constructor(
    public dialogRef: MatDialogRef<DialogLockedStatusMessageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.lockInformation = data.lockInformation;
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({ event: 'close' });
  }
}
