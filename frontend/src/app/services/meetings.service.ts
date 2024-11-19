import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  HttpEvent,
} from '@angular/common/http';

import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../environments/environment';

import { Meeting } from '../models/meeting';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService implements OnDestroy {
  private API_SERVER = environment.apiUrl;
  private REST_API_SERVER = this.API_SERVER + '/api/meeting/';
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

  createMeetingDate(meetingdetails: any): Observable<Meeting> {
    return this.httpClient
      .post<Meeting>(
        this.REST_API_SERVER,
        JSON.stringify(meetingdetails),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  updateMeetingByMeetingDate(id: string, meetingdetails: any): Observable<any> {
    return this.httpClient
      .put<Meeting>(
        this.REST_API_SERVER + id,
        JSON.stringify(meetingdetails),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getMeetingByMeetingDate(meetingdate: string): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER + 'meetingdate/' + meetingdate)
      .pipe(retry(3), catchError(this.handleError));
  }
}
