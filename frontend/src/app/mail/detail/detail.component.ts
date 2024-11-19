import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';

import { MailService } from '../../services/mail.service';

import { DialogInformationalMessageComponent } from '../../dialogs/dialog-informational-message/dialog-informational-message.component';

@Component({
  selector: 'maildetail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class MailDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  id = this.activatedRoute.snapshot.params['id'];

  mailDetail: any;

  pagetitle = 'Mail Message Detail';

  constructor(
    private mailService: MailService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.mailService
      .getMailMessageById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((messageData: any) => {
        if (messageData['status'] === 1)
          this.mailDetail = messageData['data'][0];
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  gotoMailList() {
    this.router.navigate(['/mail']);
  }

  editMail = (id: string) => {
    this.router.navigate(['mail/edit', id]);
  };

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
