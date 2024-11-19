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

import { DialogLockedStatusMessageComponent } from '../../../dialogs/dialog-locked-status-message/dialog-locked-status-message.component';
import { DialogErrorMessageComponent } from '../../../dialogs/dialog-error-message/dialog-error-message.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class BuildQueueDetailComponent implements OnInit {
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

  gotoBuildList() {
    this._router.navigate(['build']);
  }

  completeBuildButton() {
    this.checkLockStatus(this.completeBuild.bind(this));
  }

  completeBuild() {
    let currentuser = this.usersService.userInfo['fullname'];
    let assigned = this.plandetail.workflowStartBuilder;

    this.therapyplansService
      .saveBuildAction(this.id, currentuser, assigned)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((updateData: any) => {
        if (updateData['status'] === 1) {
          this.plandetail.status = 'Verification';

          // TODO send notification to pharmacists?????

          this._snackBar
            .open(updateData['message'], 'Dismiss', {
              duration: 3000,
            })
            .afterDismissed()
            .subscribe(() => {
              this._router.navigate(['build']);
            });
        } else {
          this.dialog.open(DialogErrorMessageComponent, {
            data: updateData['message'],
          });
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

  editPlanButton() {
    this.checkLockStatus(this.editPlan.bind(this));
  }

  editPlan() {
    this.therapyplansService
      .lockPlan(this.id, 'user_goes_here')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((plandata: any) => {
        if (plandata['status'] === 1) {
          this.navService.updatePreviousPage('build/detail');
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
