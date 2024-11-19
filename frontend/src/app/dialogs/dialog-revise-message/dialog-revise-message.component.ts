import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-revise-message',
  templateUrl: './dialog-revise-message.component.html',
  styleUrls: ['./dialog-revise-message.component.css'],
})
export class DialogReviseMessageComponent implements OnInit {
  fromDialog = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<DialogReviseMessageComponent>) {}

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
