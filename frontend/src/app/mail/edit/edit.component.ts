import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { MailService } from '../../services/mail.service';

import { DialogInformationalMessageComponent } from '../../dialogs/dialog-informational-message/dialog-informational-message.component';

@Component({
  selector: 'mailedit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class MailEditComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();
  public Editor = ClassicEditor.default;

  id = this.activatedRoute.snapshot.params['id'];
  mailData: any = {};

  mailForm = this.fb.group({
    _id: [''],
    workflowstep: [''],
    subject: [''],
    message: [''],
    status: [''],
    modified_date: [''],
    created_date: [''],
  });

  pagetitle = 'Edit Mail Message';

  constructor(
    private mailService: MailService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    if (!this.id) this.pagetitle = 'Create Mail Message';
  }

  ngOnInit(): void {
    if (this.id) {
      this.mailService
        .getMailMessageById(this.id)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((messagedata: any) => {
          if (messagedata['status'] === 1) {
            this.mailForm.patchValue(messagedata['data'][0]);
            this._snackBar.open(messagedata['message'], 'Dismiss', {
              duration: 3000,
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  updateMailMessage() {
    this.mailForm.patchValue({ modified_date: new Date().toISOString() });
    this.mailService
      .updateMailMessage(this.id, this.mailForm.getRawValue())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((messageData: any) => {
        let message = 'Mail message edit saved.';
        this.dialog.open(DialogInformationalMessageComponent, {
          data: { pageValue: message },
        });
        this.router.navigate(['/mail/detail', this.id]);
      });
  }

  // Create drug
  createMailMessage() {
    let tempdate = new Date().toISOString();
    this.mailForm.patchValue({
      modified_date: tempdate,
      created_date: tempdate,
    });
    this.mailService
      .createMailMessage(this.mailForm.getRawValue())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((mailData: any) => {
        if (mailData['status'] === 1) {
          let tempid = mailData['data']['_id'];
          let tempmessage = mailData['message'];
          this.dialog.open(DialogInformationalMessageComponent, {
            data: { pageValue: tempmessage },
          });
          this.router.navigate(['/mail/detail', tempid]);
        }
      });
  }

  cancelMailMessageEdit() {
    if (!this.id) this.router.navigate(['/mail']);
    else this.router.navigate(['/mail/detail', this.id]);
  }

  deleteMailMessage() {
    this.mailService
      .deleteMailMessage(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((messageData: any) => {
        if (messageData['status'] === 1) {
          let message = 'Mail message was deleted.';
          this.dialog.open(DialogInformationalMessageComponent, {
            data: { pageValue: message },
          });
          this.router.navigate(['/mail']);
        }
      });
  }
}
