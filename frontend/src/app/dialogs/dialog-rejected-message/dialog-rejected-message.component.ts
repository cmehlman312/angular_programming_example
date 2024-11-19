import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'dialog-rejected-message',
  templateUrl: './dialog-rejected-message.component.html',
  styleUrls: ['./dialog-rejected-message.component.css'],
})
export class DialogRejectedMessageComponent implements OnInit {
  // fromDialog: string;
  fromDialog = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<DialogRejectedMessageComponent>) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close({
      event: 'save',
      data: this.fromDialog.getRawValue(),
    });
  }

  cancelDialog() {
    this.dialogRef.close({ event: 'cancel', data: '' });
  }
}
