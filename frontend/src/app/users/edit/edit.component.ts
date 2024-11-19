import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UsersService } from '../../services/users.service';

import { DialogInformationalMessageComponent } from '../../dialogs/dialog-informational-message/dialog-informational-message.component';

@Component({
  selector: 'useredit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class UserEditComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  id = this.activatedRoute.snapshot.params['id'];
  userData: any = {};

  userForm = this.fb.group({
    _id: [''],
    access_requested: [''],
    accessreason: [''],
    active: [''],
    email: [''],
    firstname: [''],
    lastname: [''],
    userid: [''],
    username: [''],
    admin: [''],
    role: [''],
  });

  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.id) {
      this.getUserById(this.id);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  getUserById(id: string) {
    this.usersService
      .getUserById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((userdata: any) => {
        this.userForm.patchValue(userdata['data'][0]);
        this.userData = userdata['data'][0];
      });
  }

  updateUser() {
    this.usersService
      .updateUser(this.id, this.userForm.getRawValue())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((userData: any) => {
        if (userData['status']) {
          let message = 'User updates have been saved.';
          this.dialog.open(DialogInformationalMessageComponent, {
            data: { pageValue: message },
          });
          this.router.navigate(['/user/detail/' + this.id]);
        }
      });
  }

  cancelUserEdit() {
    this.router.navigate(['/user/detail', this.id]);
  }
}
