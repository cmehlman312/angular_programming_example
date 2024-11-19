import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Mail } from '../../models/mail';
import { MailService } from '../../services/mail.service';
@Component({
  selector: 'maillist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class MailListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  isLoading = true;
  sortingInProgress: boolean = false;
  pagetitle = 'Mail Messages';

  messages: Mail[] = [];
  dataSource: MatTableDataSource<Mail>;

  displayedColumns: string[] = [
    'workflowstep',
    'subject',
    'status',
    'modified_date',
    'detail',
    'edit',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private mailService: MailService, private _router: Router) {}

  ngOnInit(): void {
    this.loadMailMessageList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  // Get note list
  loadMailMessageList() {
    return this.mailService
      .getMailMessagesList()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((mailmessages: any) => {
        if (mailmessages['status'] === 1) {
          this.messages = mailmessages['data'] as Mail[];
          this.dataSource = new MatTableDataSource<Mail>(mailmessages['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        }
      });
  }

  public redirectToDetails = (id: string) => {
    this._router.navigate(['mail/detail', id]);
  };

  public redirectToEdit = (id: string) => {
    this._router.navigate(['mail/edit', id]);
  };

  public createNewMailMessage = () => {
    this._router.navigate(['mail/edit']);
  };
}
