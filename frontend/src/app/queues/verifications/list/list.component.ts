import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TherapyPlan } from '../../../models/therapyplan';

import { TherapyplansService } from '../../../services/therapyplans.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class VerificationQueueListComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  isLoading = true;
  sortingInProgress: boolean = false;
  pagetitle = 'Verification List';

  therapyplans: TherapyPlan[] = [];
  dataSource: MatTableDataSource<TherapyPlan>;

  displayedColumns: string[] = [
    'number',
    'medicationname',
    'specialty',
    'status',
    'requestor',
    'created',
    'detail',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private therapyplansService: TherapyplansService,
    private _router: Router,
    private usersService: UsersService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVerificationList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  loadVerificationList() {
    return this.therapyplansService
      .getVerificationList()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((plans: any) => {
        if (plans['status'] === 1) {
          for (let i = 0; i < plans['data'].length; i++) {
            let specials = '';
            for (var key in plans['data'][i].specialty) {
              if (plans['data'][i].specialty[key])
                specials += this.toTitleCase(key) + ', ';
            }
            plans['data'][i].specialty = specials;
          }
          this.therapyplans = plans['data'] as TherapyPlan[];
          this.dataSource = new MatTableDataSource<TherapyPlan>(plans['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        }
      });
  }

  public redirectToDetails = (id: string) => {
    this._router.navigate(['verification/detail', id]);
  };

  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  assignVerificationToMe(id: string) {
    let currentuser = this.usersService.userInfo['fullname'];
    this.therapyplansService
      .updateAssignedReviewer(id, currentuser)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((assignedData: any) => {
        if (assignedData['status'] === 1) {
          this.loadVerificationList();
          this._snackBar.open(assignedData['message'], 'Dismiss', {
            duration: 3000,
          });
        }
      });
  }
}
