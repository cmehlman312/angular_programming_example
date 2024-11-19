import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TherapyplansService } from '../../services/therapyplans.service';

export interface AuditTrail {
  event: string;
  comment: string;
  user: string;
  fieldsedited: string;
  role: string;
  action: string;
  dated: string;
}

@Component({
  selector: 'plan-audit-trail',
  templateUrl: './audittrail.component.html',
  styleUrls: ['./audittrail.component.css'],
})
export class AudittrailComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  lastsegment = this.activatedRoute.snapshot.url.length - 1;

  planID = this.activatedRoute.snapshot.url[this.lastsegment].path;

  isLoading = true;
  sortingInProgress: boolean = false;

  auditData: AuditTrail[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  dataSource: MatTableDataSource<AuditTrail>;

  displayedColumns: string[] = [
    'event',
    'comment',
    'user',
    'fieldsedited',
    'role',
    'action',
    'dated',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private therapyplansService: TherapyplansService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadAuditTrail();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  isArray(a: any) {
    return !!a && a.constructor === Array;
  }

  loadAuditTrail() {
    this.therapyplansService
      .getAuditTrail(this.planID)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: any) => {
        this.isLoading = false;
        // let returnedData = [];
        // let dataKeys = Object.keys(data[0]);
        // dataKeys.forEach((element) => {
        //   if (this.isArray(data[0][element])) {
        //     data[0][element].forEach((subelement: any) => {
        //       if (subelement.hasOwnProperty('event'))
        //         returnedData.push(subelement);
        //     });
        //   } else {
        //     if (data[0][element] !== null)
        //       if (data[0][element].event !== '') {
        //         if (data[0][element].hasOwnProperty('event'))
        //           returnedData.push(data[0][element]);
        //       }
        //   }
        // });
        // this.auditData = returnedData as AuditTrail[];
        // this.dataSource = new MatTableDataSource<AuditTrail>(returnedData);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        // this.isLoading = false;

        // this.dataSource.sortingDataAccessor = (
        //   item,
        //   property
        // ): string | number => {
        //   switch (property) {
        //     case 'dated':
        //       return new Date(item.dated).getTime();
        //     default:
        //       return item[property];
        //   }
        // };

        // const sortState: Sort = { active: 'dated', direction: 'desc' };
        // this.sort.active = sortState.active;
        // this.sort.direction = sortState.direction;
        // this.sort.sortChange.emit(sortState);
      });
  }

  sortData(sort: Sort) {
    this.sortingInProgress = true;
    const data = this.auditData.slice();
    if (!sort.active || sort.direction === '') {
      this.auditData = data;
      return;
    }

    this.auditData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'event':
          return compare(a.event, b.event, isAsc);
        case 'comment':
          return compare(a.comment, b.comment, isAsc);
        case 'user':
          return compare(a.user, b.user, isAsc);
        case 'fieldsedited':
          return compare(a.fieldsedited, b.fieldsedited, isAsc);
        case 'dated':
          return compare(a.dated, b.dated, isAsc);
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
function compareDate(a: string, b: string, isAsc: boolean) {
  return (new Date(a) < new Date(b) ? -1 : 1) * (isAsc ? 1 : -1);
}
