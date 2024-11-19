import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MeetingsService } from '../../services/meetings.service';
import { TherapyplansService } from '../../services/therapyplans.service';

import { TherapyPlan } from '../../models/therapyplan';

export interface Attendee {
  name: string;
}

@Component({
  selector: 'meetingdetail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class MeetingdetailComponent implements OnInit {
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

  meetingForm = this.fb.group({
    meeting_date: [''],
    meeting_time: [''],
    location: [''],
    meeting_link: [''],
    attendees: this.fb.array([]),
    notes: [''],
    status: [''],
    created_date: [''],
  });

  plannotes = new FormControl('');

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
    this.plannotes.valueChanges
      .pipe(
        debounceTime(500), // Waiting for .5 sec while you are typing
        distinctUntilChanged() // Prevents the emitting if the 'start' value and the 'end' value are the same
      )
      .subscribe((note) => {
        if (typeof this.selection.selected[0] !== 'undefined') {
          if (note)
            this.changedPlanApprovalObject[this.selection.selected[0].number][
              'meeting'
            ]['notesfrommeeting'] = note;
          else
            delete this.changedPlanApprovalObject[
              this.selection.selected[0].number
            ]['meeting']['notesfrommeeting'];
        }
      });
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
          if (meetingresponse['data'].length > 0) {
            let meetingdetails = meetingresponse['data'][0];
            this.meetingForm.patchValue(meetingdetails);
            this.meetingdetailsid = meetingdetails._id;
            if (meetingdetails['attendees'].length > 0) {
              let index = 0;
              for (let attendee of meetingdetails['attendees']) {
                this.addNewAttendee();
                this.attendeesArray().controls[index].patchValue(attendee);
                index++;
              }
            }
          } else {
            this.meetingForm.patchValue({ meeting_date: this.meetingdate });
          }
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

  selectHandler(row: TherapyPlan) {
    this.selection.toggle(row);
    this.changedPlanSelected();
  }

  loadPlanApproval(plan: any) {
    let tempPlan = this.changedPlanApprovalObject[plan.number];
    if (tempPlan.meeting.approved_date) {
      return tempPlan.meeting.approved;
    }
    return '';
  }

  changePlanApproval(plan: any, vote: any) {
    let tempAnswer = this.changedPlanApprovalObject[plan.number];

    let meeting = tempAnswer.meeting;
    let tempid = tempAnswer.id;
    if (vote === true) {
      meeting.approved = true;
      meeting.approved_date = new Date();
    } else if (vote === false) {
      meeting.approved = false;
      meeting.approved_date = new Date();
    } else {
      meeting.approved = false;
      delete meeting.approved_date;
    }
    this.changedPlanApprovalObject[plan.number] = {
      id: tempid,
      meeting: meeting,
    };
    return vote;
  }

  previouslyApproved(plan: TherapyPlan) {
    return typeof plan.meeting.approved_date === 'undefined' ? true : false;
  }

  saveMeeting() {
    if (this.meetingdetailsid) {
      this.meetingsService
        .updateMeetingByMeetingDate(
          this.meetingdetailsid,
          this.meetingForm.getRawValue()
        )
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((meetinganswer) => {
          if (meetinganswer['status']) this.savePlanApprovalVotes();
        });
    } else {
      this.meetingsService
        .createMeetingDate(this.meetingForm.getRawValue())
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((meetinganswer) => {
          if (meetinganswer['status']) this.savePlanApprovalVotes();
        });
    }
  }

  savePlanApprovalVotes() {
    for (const plannumber in this.changedPlanApprovalObject) {
      if (
        Object.prototype.hasOwnProperty.call(
          this.changedPlanApprovalObject,
          plannumber
        )
      ) {
        const plan = this.changedPlanApprovalObject[plannumber];
        if (plan['meeting']['approved_date']) {
          plan.status = 'Build';
          this.therapyplansService
            .updateTherapyPlan(plan['id'], plan)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((planupdateresponse) => {
              if (planupdateresponse['status'])
                this._snackBar.open(
                  'Meeting details have been saved',
                  'Dismiss',
                  {
                    duration: 3000,
                  }
                );
            });
        }
      }
    }
  }

  attendeesGroup(): FormGroup {
    return this.fb.group({
      name: [''],
    });
  }

  attendeesArray(): FormArray {
    return this.meetingForm.get('attendees') as FormArray;
  }

  addAttendees() {
    this.attendeesArray().push(this.attendeesGroup());
  }

  attendeeControl(index: number) {
    return this.attendeesArray().at(index).get('name') as FormControl;
  }

  ManageNameControl(index: number) {
    this.filteredOptions[index] = this.attendeeControl(index).valueChanges.pipe(
      startWith<string | Attendee>(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }
  addNewAttendee() {
    const controls = <FormArray>this.meetingForm.controls['attendees'];
    let formGroup = this.fb.group({
      name: [''],
    });
    controls.push(formGroup);
    // Build the account Auto Complete values
    this.ManageNameControl(controls.length - 1);
  }

  removeAttendee(i: number) {
    const controls = <FormArray>this.meetingForm.controls['attendees'];
    controls.removeAt(i);
    // remove from filteredOptions too.
    this.filteredOptions.splice(i, 1);
  }

  private _filter(name: string): Attendee[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  filterOptions(name: string) {
    return this.options.filter(
      (option) => option.name.toLowerCase().indexOf(name) === 0
    );
  }

  onAttendeeEnter(evt: any, index: number) {
    if (evt.source.selected) {
      setTimeout(() => {
        this.attendeesArray().at(index).patchValue(evt.source.value);
      }, 0);
    }
  }

  changedPlanSelected() {
    this.plannotes.patchValue('');

    if (typeof this.selection.selected[0] !== 'undefined') {
      let tempNote =
        this.changedPlanApprovalObject[this.selection.selected[0].number][
          'meeting'
        ]['notesfrommeeting'];
      let tempNoteValue = tempNote ? tempNote : '';

      this.plannotes.patchValue(tempNoteValue);
      // this.changedPlanApprovalObject[this.selection.selected[0].number][
      //   'meeting'
      // ]['notesfrommeeting'] = note;
    }
  }

  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  options: Attendee[] = [
    { name: 'Alan' },
    { name: 'Albert' },
    { name: 'Arthur' },
    { name: 'Austin' },
    { name: 'Billy' },
    { name: 'Bobby' },
    { name: 'Bradley' },
    { name: 'Bruce' },
    { name: 'Bryan' },
    { name: 'Carl' },
    { name: 'Christian' },
    { name: 'Dylan' },
    { name: 'Elijah' },
    { name: 'Ethan' },
    { name: 'Eugene' },
    { name: 'Gabriel' },
    { name: 'Gerald' },
    { name: 'Harold' },
    { name: 'Jeremy' },
    { name: 'Jesse' },
    { name: 'Joe' },
    { name: 'Jordan' },
    { name: 'Juan' },
    { name: 'Keith' },
    { name: 'Kyle' },
    { name: 'Lawrence' },
    { name: 'Logan' },
    { name: 'Mason' },
    { name: 'Noah' },
    { name: 'Peter' },
    { name: 'Philip' },
    { name: 'Ralph' },
    { name: 'Randy' },
    { name: 'Roger' },
    { name: 'Roy' },
    { name: 'Russell' },
    { name: 'Sean' },
    { name: 'Terry' },
    { name: 'Vincent' },
    { name: 'Walter' },
    { name: 'Wayne' },
    { name: 'Willie' },
  ];
}
