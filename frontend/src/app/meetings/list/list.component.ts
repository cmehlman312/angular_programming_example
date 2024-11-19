import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TherapyplansService } from '../../services/therapyplans.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'meetinglist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class MeetinglistComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  isRole$: Observable<string>;

  meetingcarddates: any;

  constructor(
    private therapyplansService: TherapyplansService,
    private _router: Router,
    private usersService: UsersService
  ) {
    this.isRole$ = this.usersService.isRole;
  }

  ngOnInit(): void {
    this.loadMeetingCards();
  }

  loadMeetingCards() {
    this.therapyplansService
      .getFutureMeetingDetails()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((meetings) => {
        this.meetingcarddates = meetings.data;
      });
  }

  viewDetails(meetingdate: string) {
    this.isRole$.subscribe((roled) => {
      let tempRole = roled.toLowerCase();
      if (tempRole === 'willow')
        this._router.navigate(['meeting/detail', meetingdate]);
      else this._router.navigate(['meeting/view', meetingdate]);
    });
    // this._router.navigate(['meeting/detail', meetingdate]);
  }
}
