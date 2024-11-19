import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MeetingsService } from '../../services/meetings.service';
import { TherapyplansService } from '../../services/therapyplans.service';

import { TherapyPlan } from '../../models/therapyplan';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class MeetingViewComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  meetingdateurl = this.activatedRoute.snapshot.params['meetingdate'];

  plandetails: TherapyPlan[];

  displayedColumns: string[] = [
    'select',
    'number',
    'medicationname',
    'specialty',
    'requestor',
    'vote',
  ];
  dataSource: MatTableDataSource<TherapyPlan>;

  selection = new SelectionModel<TherapyPlan>(false, []);

  filteredOptions: Observable<any[]>[] = [];

  changedPlanApprovalObject: any = [];

  meetingdetailsid: string = '';
  meetingInformation: any;

  plannotes: string = '';

  meetingdate;

  // public Editor = ClassicEditor;
  public Editor = ClassicEditor.default;

  constructor(
    private activatedRoute: ActivatedRoute,
    private meetingsService: MeetingsService,
    private therapyplansService: TherapyplansService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.meetingdate = new Date(this.meetingdateurl).toISOString();
  }

  ngOnInit(): void {
    this.loadMeetingDetail();
    this.loadPlansForMeetingDate();
  }

  loadMeetingDetail() {
    this.meetingsService
      .getMeetingByMeetingDate(this.meetingdate)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((meetingresponse: any) => {
        if (meetingresponse['status'] === 1) {
          for (let i = 0; i < meetingresponse['data'].length; i++) {
            let specials = '';
            for (var key in meetingresponse['data'][i].specialty) {
              if (meetingresponse['data'][i].specialty[key])
                specials += this.toTitleCase(key) + ', ';
            }
            meetingresponse['data'][i].specialty = specials;
          }
          this.meetingInformation = meetingresponse['data'][0];
        }
      });
  }

  loadPlansForMeetingDate() {
    this.therapyplansService
      .getPlansForMeeting(this.meetingdate)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((plansformeeting: any) => {
        for (let i = 0; i < plansformeeting['data'].length; i++) {
          let specials = '';
          for (var key in plansformeeting['data'][i].specialty) {
            if (plansformeeting['data'][i].specialty[key])
              specials += this.toTitleCase(key) + ', ';
          }
          plansformeeting['data'][i].specialty = specials;
        }
        this.plandetails = plansformeeting['data'];
        this.dataSource = new MatTableDataSource<TherapyPlan>(this.plandetails);
        this.plandetails.forEach((element: any) => {
          this.changedPlanApprovalObject[element.number] = {
            id: element._id,
            meeting: element.meeting,
          };
        });
      });
  }

  loadPlanApproval(plan: any) {
    let tempPlan = this.changedPlanApprovalObject[plan.number];
    if (tempPlan.meeting.approved_date) {
      return tempPlan.meeting.approved;
    }
    return '';
  }

  selectHandler(row: TherapyPlan) {
    this.selection.toggle(row);
    this.changedPlanSelected();
  }

  changedPlanSelected() {
    this.plannotes = '';

    if (typeof this.selection.selected[0] !== 'undefined') {
      let tempNote =
        this.changedPlanApprovalObject[this.selection.selected[0].number][
          'meeting'
        ]['notesfrommeeting'];
      let tempNoteValue = tempNote ? tempNote : '';

      this.plannotes = tempNoteValue;
    }
  }

  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
