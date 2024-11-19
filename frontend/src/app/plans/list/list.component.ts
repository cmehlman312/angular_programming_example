import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TherapyPlan } from '../../models/therapyplan';
import { TherapyplansService } from '../../services/therapyplans.service';

@Component({
  selector: 'planlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class PlanlistComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  isLoading = true;
  sortingInProgress: boolean = false;
  pagetitle = 'Therapy Plans';

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
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loadTherapyPlans();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  // Get note list
  loadTherapyPlans() {
    return this.therapyplansService
      .getTherapyPlanList()
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
    this._router.navigate(['plan/detail', id]);
  };

  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
