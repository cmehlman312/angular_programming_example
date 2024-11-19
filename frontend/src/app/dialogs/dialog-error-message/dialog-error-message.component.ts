import { Component, OnInit, Inject, Optional } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
@Component({
  selector: 'dialog-error-message',
  templateUrl: './dialog-error-message.component.html',
  styleUrls: ['./dialog-error-message.component.css'],
})
export class DialogErrorMessageComponent implements OnInit {
  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogErrorMessageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.errorMessage = data;
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({ event: 'close' });
  }
}
