import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UsersService } from '../../services/users.service';
import { MailService } from '../../services/mail.service';

import { DialogInformationalMessageComponent } from '../../dialogs/dialog-informational-message/dialog-informational-message.component';

@Component({
  selector: 'userdetail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private mailService: MailService,
    public dialog: MatDialog
  ) {}

  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  id = this._activatedRoute.snapshot.params['id'];

  userDetail: any;

  ngOnInit(): void {
    this.getUserById();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  getUserById() {
    this.usersService
      .getUserById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((userdata: any) => {
        if (userdata['status']) this.userDetail = userdata['data'][0];
      });
  }

  gotoUserList() {
    this.router.navigate(['/user']);
  }

  public editUser = (id: string) => {
    this.router.navigate(['user/edit', id]);
  };

  grantUserAccess(id: string) {
    let updateGrantedFields = {
      active: true,
      access_requested: false,
    };

    this.usersService
      .grantAccess(id, updateGrantedFields)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((granteddata: any) => {
        if (granteddata.status === 1) {
          this.mailService
            .sendEmailGrantUserAccess(this.userDetail.email)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {});
          const dialogRef = this.dialog.open(
            DialogInformationalMessageComponent,
            {
              data: { pageValue: granteddata.message },
            }
          );

          dialogRef
            .afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {
              this.router.navigate(['user']);
            });
        }
      });
  }

  revokeUserAccess(id: string) {
    let updateRevokeFields = {
      active: false,
    };

    this.usersService
      .revokeAccess(id, updateRevokeFields)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((revokeddata: any) => {
        if (revokeddata.status === 1) {
          const dialogRef = this.dialog.open(
            DialogInformationalMessageComponent,
            {
              data: { pageValue: revokeddata.message },
            }
          );

          dialogRef
            .afterClosed()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {
              this.router.navigate(['user']);
            });
        }
      });
  }
}
