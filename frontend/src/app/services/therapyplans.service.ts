import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../environments/environment';

import { TherapyPlan } from '../models/therapyplan';

@Injectable({
  providedIn: 'root',
})
export class TherapyplansService implements OnDestroy {
  private API_SERVER = environment.apiUrl;
  private REST_API_SERVER = this.API_SERVER + '/api/therapyplan/';
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient, public dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  createTherapyPlan(therapyplan: any): Observable<TherapyPlan> {
    return this.httpClient
      .post<TherapyPlan>(
        this.REST_API_SERVER,
        JSON.stringify(therapyplan),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getTherapyPlanList(): Observable<TherapyPlan> {
    return this.httpClient
      .get<TherapyPlan>(this.REST_API_SERVER + 'list')
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllTherapyPlans(): Observable<TherapyPlan> {
    return this.httpClient
      .get<TherapyPlan>(this.REST_API_SERVER)
      .pipe(retry(3), catchError(this.handleError));
  }

  getTherapyPlanById(id: string): Observable<TherapyPlan> {
    return this.httpClient
      .get<TherapyPlan>(this.REST_API_SERVER + id)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateTherapyPlan(id: string, plan: any): Observable<TherapyPlan> {
    return this.httpClient
      .put<TherapyPlan>(
        this.REST_API_SERVER + id,
        JSON.stringify(plan),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  lockPlan(id: string, user: string): Observable<TherapyPlan> {
    return this.httpClient
      .put<TherapyPlan>(
        this.REST_API_SERVER + 'lockplan/' + id,
        JSON.stringify({ user }),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  unlockPlan(id: string): Observable<any> {
    return this.httpClient
      .put<any>(this.REST_API_SERVER + 'unlockplan/' + id, {}, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  getNextPlanNumber(): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER + 'nextnumber')
      .pipe(retry(3), catchError(this.handleError));
  }

  getPlanLockStatus(id: string): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER + 'lockstatus/' + id)
      .pipe(retry(3), catchError(this.handleError));
  }

  getFutureMeetingDates(): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER + 'futuremeetingdates')
      .pipe(retry(3), catchError(this.handleError));
  }

  saveMeetingDate(id: string, meetingdate: any): Observable<any> {
    return this.httpClient
      .put<any>(
        this.REST_API_SERVER + 'meetingdate/' + id,
        JSON.stringify({ agendadate: meetingdate }),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getPlansForMeeting(meetingdate: string): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER + 'plansformeeting/' + meetingdate)
      .pipe(retry(3), catchError(this.handleError));
  }

  getFutureMeetingDetails(): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER + 'futuremeetingdetails')
      .pipe(retry(3), catchError(this.handleError));
  }

  getReviewList(): Observable<TherapyPlan> {
    return this.httpClient
      .get<TherapyPlan>(this.REST_API_SERVER + 'reviewlist')
      .pipe(retry(3), catchError(this.handleError));
  }

  getBuildList(): Observable<TherapyPlan> {
    return this.httpClient
      .get<TherapyPlan>(this.REST_API_SERVER + 'buildlist')
      .pipe(retry(3), catchError(this.handleError));
  }

  getVerificationList(): Observable<TherapyPlan> {
    return this.httpClient
      .get<TherapyPlan>(this.REST_API_SERVER + 'verificationlist')
      .pipe(retry(3), catchError(this.handleError));
  }

  getAuditTrail(id: string): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER + 'audittrail/' + id)
      .pipe(retry(3), catchError(this.handleError));
  }

  submitForReview(id: string): Observable<any> {
    return this.httpClient
      .put<any>(
        this.REST_API_SERVER + 'submitforreview/' + id,
        JSON.stringify({}),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  saveReviewAction(
    id: string,
    action: string,
    user: string,
    assigned: string,
    comment: string = ''
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        this.REST_API_SERVER + 'savereviewaction/' + id,
        JSON.stringify({
          action: action,
          currentuser: user,
          assigned: assigned,
          comment: comment,
        }),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  saveBuildAction(
    id: string,
    user: string,
    assigned: string,
    comment: string = ''
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        this.REST_API_SERVER + 'savebuildaction/' + id,
        JSON.stringify({
          currentuser: user,
          assigned: assigned,
          comment: comment,
        }),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  saveVerificationAction(
    id: string,
    action: string,
    user: string,
    assigned: string,
    comment: string = ''
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        this.REST_API_SERVER + 'saveverificationaction/' + id,
        JSON.stringify({
          action: action,
          currentuser: user,
          assigned: assigned,
          comment: comment,
        }),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  updateMeetingPlanVote(id: string, plan: any): Observable<TherapyPlan> {
    return this.httpClient
      .put<TherapyPlan>(
        this.REST_API_SERVER + 'meetingplanvote/' + id,
        JSON.stringify(plan),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  updateAssignedBuilder(id: string, user: string): Observable<any> {
    return this.httpClient
      .put<any>(
        this.REST_API_SERVER + 'assignbuilder/' + id,
        JSON.stringify({ user }),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  updateAssignedReviewer(id: string, user: string): Observable<any> {
    return this.httpClient
      .put<any>(
        this.REST_API_SERVER + 'assignreviewer/' + id,
        JSON.stringify({ user }),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  updateAssignedVerifier(id: string, user: string): Observable<any> {
    return this.httpClient
      .put<any>(
        this.REST_API_SERVER + 'assignverifier/' + id,
        JSON.stringify({ user }),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }
}
