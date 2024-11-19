import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';

import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { UsersService } from '../../services/users.service';
import { MailService } from '../../services/mail.service';
import { NavService } from '../../services/nav.service';

import { DialogInformationalMessageComponent } from '../../dialogs/dialog-informational-message/dialog-informational-message.component';
import { UserListComponent } from '../list/list.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  public isAuthenticated$!: Observable<boolean>;
  public name$!: Observable<string>;

  pageRoute = this.activatedRoute.snapshot.url[1].path;

  userInfo: any = [];
  requestreason = new FormControl('');
  userForm = this.fb.group({
    firstname: [''],
    lastname: [''],
    title: [''],
    email: [''],
    accessreason: [''],
    access_requested: [''],
  });
  userExists = false;
  userAllowed = false;
  isLoggedIn: boolean = false;
  isAuthorized = false;

  isAuthenticated: boolean = false;
  error: Error | null = null;
  userName: string = '';

  callbackTest: boolean = false;

  userinformation: any = {};

  constructor(
    @Inject(OKTA_AUTH) public oktaAuth: OktaAuth,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private mailService: MailService,
    private _router: Router,
    private navService: NavService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      const userClaims = await this.oktaAuth.getUser();
      this.userName = userClaims.name as string;

      let tempClaims: any = userClaims;

    // TODO map okta fields to application fields

      this.checkUserInformation(tempClaims['userid'], tempClaims);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  checkUserInformation(userid: string, tempclaims: any) {
    this.usersService
      .getUserInformation(userid)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((userinformation: any) => {
        if (userinformation['status'] === 1) {
          if (userinformation['data']) {
            let tempuserinformation = userinformation['data'];
            if (tempuserinformation !== null) {
              this.userExists = true;
              if (tempuserinformation.active) {
                this.usersService.updateRoles(
                  tempuserinformation.role,
                  tempuserinformation.admin
                );
              }
              this.userAllowed =
                tempuserinformation.access_requested === false &&
                tempuserinformation.active === true
                  ? true
                  : false;

              if (this.userAllowed) {
                this.navService.setCurrentUser(this.userName);
                this.usersService.updateLoggedInStatus();
                this._router.navigate(['/']);
              }
            } else {
              this.userForm.patchValue(tempclaims);
              this.userExists = false;
            }
          } else {
            this.userForm.patchValue(tempclaims);
            this.userExists = false;
          }
        }
      });
  }

  submitAccessRequest() {
    this.userForm.get('access_requested')?.setValue('true');
    this.usersService
      .createNewUser(this.userForm.getRawValue())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((newuserdata: any) => {
        let tempname =
          this.userForm.get('firstname')?.value +
          ' ' +
          this.userForm.get('lastname')?.value;
        let tempreason: any = this.userForm.get('accessreason')?.value;

        this.usersService
          .getAdminEmailList()
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((emaillist: any) => {
            let templist = emaillist['data'];
            let tempemails = templist.join(';');
            this.mailService
              .sendAccessRequest(tempname, tempreason, tempemails)
              .pipe(takeUntil(this.ngUnsubscribe$))
              .subscribe((newuserdata: any) => {});

            let dialogMessage = 'Access request submitted.';
            const dialogRef = this.dialog.open(
              DialogInformationalMessageComponent,
              {
                data: { pageValue: dialogMessage },
              }
            );

            dialogRef
              .afterClosed()
              .pipe(takeUntil(this.ngUnsubscribe$))
              .subscribe(() => {
                this._router.navigate(['/']);
              });
          });
      });
  }
}
