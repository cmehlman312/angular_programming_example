import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TherapyplansService } from '../../services/therapyplans.service';
import { UsersService } from '../../services/users.service';

import { DialogLockedStatusMessageComponent } from '../../dialogs/dialog-locked-status-message/dialog-locked-status-message.component';
import { DialogErrorMessageComponent } from '../../dialogs/dialog-error-message/dialog-error-message.component';

@Component({
  selector: 'plandetail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class PlandetailComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  isRole$: Observable<string>;

  id = this.activatedRoute.snapshot.params['id'];

  previousPageName = 'Plan';

  plandetail: any = {};

  showEditButton: boolean = false;
  showSubmitForReviewButton: boolean = false;
  showSubmitForMeetingButton: boolean = false;
  showRevertToDraftButton: boolean = false;
  showCopyButton: boolean = false;

  constructor(
    private therapyplansService: TherapyplansService,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private usersService: UsersService
  ) {
    this.isRole$ = this.usersService.isRole;
  }

  ngOnInit(): void {
    this.loadPlanDetail();
  }

  loadPlanDetail() {
    this.therapyplansService
      .getTherapyPlanById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((plandata: any) => {
        this.plandetail = plandata.data[0];
        this.showhideButtons(this.plandetail.status);
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
        if (plandata['status'] === 1)
          this._router.navigate(['plan/edit', this.id]);
        else {
          let tempMessage = plandata['data'][0]['message'];
          const dialogRef = this.dialog.open(DialogErrorMessageComponent, {
            data: tempMessage,
          });
        }
      });
  }

  copyPlan() {
    this._router.navigate(['plan/copy', this.id]);
  }

  gotoPlanList() {
    this._router.navigate(['plan']);
  }

  submitforreviewPlanButton() {
    this.checkLockStatus(this.submitforreviewPlan.bind(this));
  }

  submitforreviewPlan() {
    this.therapyplansService
      .updateTherapyPlan(this.id, {
        status: 'In Review',
        workflowStartReviewer: new Date().toISOString(),
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((updateData: any) => {
        this.plandetail.status = 'In Review';
        if (updateData['status'] === 1)
          this._snackBar.open('Submitted for Review', 'Dismiss', {
            duration: 3000,
          });
      });
  }

  reverttodraftPlanButton() {
    this.checkLockStatus(this.reverttodraftPlan.bind(this));
  }

  reverttodraftPlan() {
    this.therapyplansService
      .updateTherapyPlan(this.id, {
        status: 'Draft',
        workflowStartReviewer: '',
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((updateData: any) => {
        this.plandetail.status = 'Draft';
        if (updateData['status'] === 1)
          this._snackBar.open(
            'Therapy Plan reverted back to draft status',
            'Dismiss',
            {
              duration: 3000,
            }
          );
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

  showhideButtons(status: string) {
    this.isRole$.subscribe((roled) => {
      let tempRole = roled.toLowerCase();
      if (
        tempRole === 'pharmacist' ||
        tempRole === 'ambulatory' ||
        tempRole === 'willow'
      ) {
        if (status === 'Draft' || status === 'Revise') {
          this.showEditButton = true;
          this.showSubmitForReviewButton = true;
          this.showSubmitForMeetingButton = false;
          this.showRevertToDraftButton = false;
          this.showCopyButton = true;
        } else {
          this.showEditButton = false;
          this.showSubmitForReviewButton = false;
          this.showSubmitForMeetingButton = false;
          this.showRevertToDraftButton = true;
          this.showCopyButton = true;
        }
      } else {
        this.showEditButton = false;
        this.showSubmitForReviewButton = false;
        this.showSubmitForMeetingButton = false;
        this.showRevertToDraftButton = false;
        this.showCopyButton = false;
      }
    });
  }

  @ViewChild('printplanDetails') myTempRef: ElementRef;

  printPlanDetails() {
    // const DATA = elementID.nativeElement;
    // const doc: jsPDF = new jsPDF('p', 'mm', 'a4');
    // doc.html(DATA, {
    //   callback: (doc) => {
    //     doc.output('dataurlnewwindow');
    //   },
    // });
  }
}
