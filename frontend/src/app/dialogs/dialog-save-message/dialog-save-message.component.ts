import { Component, OnInit, Inject, Optional } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'dialog-save-message',
  templateUrl: './dialog-save-message.component.html',
  styleUrls: ['./dialog-save-message.component.css'],
})
export class DialogSaveMessageComponent implements OnInit {
  savedMessage: string = '';
  constructor(
    public dialogRef: MatDialogRef<DialogSaveMessageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.savedMessage = data.savedMessage;
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close({ event: 'close' });
  }
}
