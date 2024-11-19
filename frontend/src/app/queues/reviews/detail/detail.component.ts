import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TherapyplansService } from '../../../services/therapyplans.service';
import { MailService } from '../../../services/mail.service';
import { NavService } from '../../../services/nav.service';
import { UsersService } from '../../../services/users.service';

import { DialogSubmitToMeetingComponent } from '../../../dialogs/dialog-submit-to-meeting/dialog-submit-to-meeting.component';
import { DialogLockedStatusMessageComponent } from '../../../dialogs/dialog-locked-status-message/dialog-locked-status-message.component';
import { DialogRejectedMessageComponent } from '../../../dialogs/dialog-rejected-message/dialog-rejected-message.component';
import { DialogReviseMessageComponent } from '../../../dialogs/dialog-revise-message/dialog-revise-message.component';
import { DialogErrorMessageComponent } from '../../../dialogs/dialog-error-message/dialog-error-message.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class ReviewQueueDetailComponent implements OnInit {
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
    private navService: NavService,
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

  gotoReviewList() {
    this._router.navigate(['review']);
  }

  rejectReviewButton() {
    this.checkLockStatus(this.rejectReview.bind(this));
  }

  rejectReview() {
    let actiontaken = 'Rejected';
    let currentuser = this.usersService.userInfo['fullname'];
    const dialogRef = this.dialog.open(DialogRejectedMessageComponent, {});
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((rejected) => {
        if (rejected.event === 'save') {
          this.therapyplansService
            .saveReviewAction(
              this.id,
              actiontaken,
              currentuser,
              this.plandetail.workflowStartReviewer,
              rejected.data
            )
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((actionstatus: any) => {
              if (actionstatus['status'] === 1) {
                this.plandetail.status = actiontaken;
                this.sendReviewEmailRejected(rejected.data, currentuser);
                this._snackBar
                  .open('Review Rejected saved', 'Dismiss', {
                    duration: 3000,
                  })
                  .afterDismissed()
                  .subscribe(() => {
                    this._router.navigate(['review']);
                  });
              }
            });
        }
      });
  }

  reviseReviewButton() {
    this.checkLockStatus(this.reviseReview.bind(this));
  }

  reviseReview() {
    let actiontaken = 'Revise';
    let currentuser = this.usersService.userInfo['fullname'];
    const dialogRef = this.dialog.open(DialogReviseMessageComponent, {});
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((revisedata) => {
        if (revisedata.event === 'save') {
          this.therapyplansService
            .saveReviewAction(
              this.id,
              actiontaken,
              currentuser,
              this.plandetail.workflowStartReviewer,
              revisedata.data
            )
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((result: any) => {
              if (result['status'] === 1) {
                this.plandetail.status = actiontaken;
                this.sendReviewEmailRevise(revisedata.data, currentuser);
                this._snackBar
                  .open('Review Revise saved', 'Dismiss', {
                    duration: 3000,
                  })
                  .afterDismissed()
                  .subscribe(() => {
                    this._router.navigate(['review']);
                  });
              }
            });
        }
      });
  }

  approveReviewButton() {
    this.checkLockStatus(this.approveReview.bind(this));
  }

  approveReview() {
    let currentuser = this.usersService.userInfo['fullname'];
    this.therapyplansService
      .saveReviewAction(
        this.id,
        'Approve',
        currentuser,
        this.plandetail.workflowStartReviewer,
        ''
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((approvedData: any) => {
        if (approvedData['status'] === 1) {
          this.submittomeetingPlan();
        }
      });
  }

  submittomeetingPlan() {
    this.therapyplansService
      .getFutureMeetingDates()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((meetingdates: any) => {
        let meetingDatesArray = meetingdates.data.map(
          (item: any) => item.meetingdates
        );
        const dialogRef = this.dialog.open(DialogSubmitToMeetingComponent, {
          data: {
            futuremeetingdates: meetingDatesArray,
            currentmeetingdate: this.plandetail.meeting.agenda_date,
          },
        });

        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((dialogData: any) => {
            if (typeof dialogData !== 'undefined') {
              if (dialogData.event === 'save') {
                this.saveMeetingDate(dialogData.data);
              }
            }
          });
      });
  }

  saveMeetingDate(result: any) {
    this.therapyplansService
      .saveMeetingDate(this.id, result)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((returnedData: any) => {
        if (returnedData['status'] === 1) {
          this._snackBar
            .open('Saved meeting date for therapy plan', 'Dismiss', {
              duration: 3000,
            })
            .afterDismissed()
            .subscribe(() => {
              this._router.navigate(['review']);
            });
          this.plandetail.status = 'Meeting';
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

  sendReviewEmailRejected(reason: string, currentuser: string) {
    let requestor = this.plandetail.requestor;
    let number = this.plandetail.number;
    let medicationname = this.plandetail.medicationname;
    this.usersService
      .getUserEmailInformation([requestor])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((requestoremail: any) => {
        if (requestoremail['status'] === 1) {
          let email = requestoremail['data'][0]['email'];
          this.mailService
            .sendEmailReviewRejected(
              number,
              medicationname,
              email,
              reason,
              currentuser
            )
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {});
        } else {
          const dialogRef = this.dialog.open(DialogErrorMessageComponent, {
            data: requestoremail['message'],
          });
        }
      });
  }

  sendReviewEmailRevise(reason: string, currentuser: string) {
    let requestor = this.plandetail.requestor;
    let number = this.plandetail.number;
    let medicationname = this.plandetail.medicationname;
    this.usersService
      .getUserEmailInformation([requestor])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((requestoremail: any) => {
        if (requestoremail['status'] === 1) {
          let email = requestoremail['data'][0]['email'];
          this.mailService
            .sendEmailReviewRevise(
              number,
              medicationname,
              email,
              reason,
              currentuser
            )
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {});
        } else {
          const dialogRef = this.dialog.open(DialogErrorMessageComponent, {
            data: requestoremail['message'],
          });
        }
      });
  }

  editPlanButton() {
    this.checkLockStatus(this.editPlan.bind(this));
  }

  editPlan() {
    this.therapyplansService
      .lockPlan(this.id, 'user_goes_here')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((plandata: any) => {
        if (plandata['status'] === 1) {
          this.navService.updatePreviousPage('review/detail');
          this._router.navigate(['plan/edit', this.id]);
        } else {
          let tempMessage = plandata['data'][0]['message'];
          const dialogRef = this.dialog.open(DialogErrorMessageComponent, {
            data: tempMessage,
          });
        }
      });
  }
}
