import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TherapyplansService } from '../../../services/therapyplans.service';
import { MailService } from '../../../services/mail.service';
import { UsersService } from '../../../services/users.service';

import { DialogLockedStatusMessageComponent } from '../../../dialogs/dialog-locked-status-message/dialog-locked-status-message.component';
import { DialogReviseMessageComponent } from '../../../dialogs/dialog-revise-message/dialog-revise-message.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class VerificationQueueDetailComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();
  id = this.activatedRoute.snapshot.params['id'];

  plandetail: any = {};

  constructor(
    private therapyplansService: TherapyplansService,
    private mailService: MailService,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadPlanDetail();
  }

  loadPlanDetail() {
    this.therapyplansService
      .getTherapyPlanById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((plandata: any) => {
        this.plandetail = plandata.data[0];
      });
  }

  gotoVerificationList() {
    this._router.navigate(['verification']);
  }

  reviseVerificationButton() {
    this.checkLockStatus(this.reviseVerification.bind(this));
  }

  reviseVerification() {
    let nextStatusName = 'Build Revise';
    let currentuser = this.usersService.userInfo['fullname'];
    const dialogRef = this.dialog.open(DialogReviseMessageComponent, {});
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((revisedata) => {
        if (revisedata.event === 'save') {
          this.therapyplansService
            .saveVerificationAction(
              this.id,
              'Revise',
              currentuser,
              this.plandetail.workflowStartVerifier,
              revisedata.data
            )
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((savedaction: any) => {
              if (savedaction['status'] === 1) {
                this.plandetail.status = nextStatusName;
                this.sendVerificationReviseEmail(revisedata.data, currentuser);
                this._snackBar
                  .open(savedaction['message'], 'Dismiss', {
                    duration: 3000,
                  })
                  .afterDismissed()
                  .subscribe(() => {
                    this._router.navigate(['verification']);
                  });
              }
            });
        }
      });
  }

  sendVerificationReviseEmail(revisereason: string, currentuser: string) {
    let requestor = this.plandetail.requestor;
    let medicationname = this.plandetail.medicationname;
    let plannumber = this.plandetail.number;

    this.usersService
      .getUserEmailInformation([requestor])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((requestoremail: any) => {
        if (requestoremail['status'] === 1) {
          let email = requestoremail['data'][0]['email'];
          this.mailService.sendEmailVerificationRevise(
            plannumber,
            medicationname,
            email,
            revisereason,
            currentuser
          );
        }
      });
  }

  approveVerificationButton() {
    this.checkLockStatus(this.approveVerification.bind(this));
  }

  approveVerification() {
    let actiontaken = 'Approved';
    let currentuser = this.usersService.userInfo['fullname'];
    this.therapyplansService
      .saveVerificationAction(
        this.id,
        actiontaken,
        currentuser,
        this.plandetail.workflowStartVerifier,
        ''
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((approvedaction: any) => {
        if (approvedaction['status'] === 1) {
          this.plandetail.status = 'Complete';
          this.sendVerificationApprovedEmail();
          this._snackBar
            .open('Verification complete action saved', 'Dismiss', {
              duration: 3000,
            })
            .afterDismissed()
            .subscribe(() => {
              // this._router.navigate(['verification']);
            });
        }
      });
  }

  sendVerificationApprovedEmail() {
    let requestor = this.plandetail.requestor;
    let medicationname = this.plandetail.medicationname;
    let plannumber = this.plandetail.number;

    this.usersService
      .getUserEmailInformation([requestor])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((requestoremail: any) => {
        if (requestoremail['status'] === 1) {
          let email = requestoremail['data'][0]['email'];
          this.mailService.sendEmailVerificationApproved(
            plannumber,
            medicationname,
            email
          );
        }
      });
  }

  checkLockStatus(callback: Function) {
    this.therapyplansService
      .getPlanLockStatus(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((lockdata: any) => {
        let tempLockStatus = lockdata['data'][0]['isLocked'];
        if (tempLockStatus === false || typeof tempLockStatus === 'undefined') {
          callback();
        } else {
          const dialogRef = this.dialog.open(
            DialogLockedStatusMessageComponent,
            {
              data: { lockInformation: lockdata['data'][0] },
            }
          );
        }
      });
  }
}
