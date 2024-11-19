import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { User } from '../../models/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'userlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class UserListComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLoading = true;
  sortingInProgress: boolean = false;
  pagetitle = 'User List';

  users: User[] = [];
  dataSource: MatTableDataSource<User>;

  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'role',
    'active',
    'access_requested',
    'details',
    'edit',
  ];

  constructor(private usersService: UsersService, private _router: Router) {}

  ngOnInit(): void {
    this.loadUserList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  // Get note list
  loadUserList() {
    return this.usersService
      .getUserList()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((users: any) => {
        if (users['status'] === 1) {
          this.users = users['data'] as User[];
          this.dataSource = new MatTableDataSource<User>(users['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        }
      });
  }

  public redirectToDetails = (id: string) => {
    this._router.navigate(['user/detail', id]);
  };

  public redirectToEdit = (id: string) => {
    this._router.navigate(['user/edit', id]);
  };

  public doFilter = (event: any) => {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  };

  sortData(sort: Sort) {
    this.sortingInProgress = true;
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.users = data;
      return;
    }

    this.users = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstname':
          return compare(
            a.firstname.toLowerCase(),
            b.firstname.toLowerCase(),
            isAsc
          );
        case 'lastname':
          return compare(
            a.lastname.toLowerCase(),
            b.lastname.toLowerCase(),
            isAsc
          );
        case 'active':
          return compare(a.active.toString(), b.active.toString(), isAsc);
        case 'access_requested':
          return compare(
            a.access_requested.toString(),
            b.access_requested.toString(),
            isAsc
          );
        default:
          return 0;
      }
    });
    this.sortingInProgress = false;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
