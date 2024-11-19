import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';

import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError, takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../environments/environment';

import { Mail } from '../models/mail';

@Injectable({
  providedIn: 'root',
})
export class MailService implements OnDestroy {
  private API_SERVER = environment.apiUrl;
  private REST_API_SERVER = this.API_SERVER + '/api/mail/';
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
      () => new Error('Something bad happened; please try again later.' + error)
    );
  }

  createMailMessage(mailmessage: any): Observable<Mail> {
    return this.httpClient
      .post<Mail>(
        this.REST_API_SERVER,
        JSON.stringify(mailmessage),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllMailMessages(): Observable<Mail> {
    return this.httpClient
      .get<Mail>(this.REST_API_SERVER)
      .pipe(retry(3), catchError(this.handleError));
  }

  getMailMessagesList(): Observable<Mail> {
    return this.httpClient
      .get<Mail>(this.REST_API_SERVER + 'list')
      .pipe(retry(3), catchError(this.handleError));
  }

  getMailMessageById(id: string): Observable<Mail> {
    return this.httpClient
      .get<Mail>(this.REST_API_SERVER + id)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateMailMessage(id: string, mail: any): Observable<Mail> {
    return this.httpClient
      .put<Mail>(
        this.REST_API_SERVER + id,
        JSON.stringify(mail),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteMailMessage(id: string): Observable<Mail> {
    return this.httpClient
      .delete<Mail>(this.REST_API_SERVER + id)
      .pipe(retry(3), catchError(this.handleError));
  }

  sendEmailReviewRejected(
    number: string,
    medicationname: string,
    email: string,
    reason: string,
    reviewer: string
  ) {
    let params = new HttpParams();
    params = params.append('number', number);
    params = params.append('medicationname', medicationname);
    params = params.append('email', email);
    params = params.append('reason', reason);
    params = params.append('reviewer', reviewer);

    return this.httpClient
      .get(this.REST_API_SERVER + 'sendreviewrejected', {
        params: params,
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  sendEmailReviewRevise(
    number: string,
    medicationname: string,
    email: string,
    reason: string,
    reviewer: string
  ) {
    let params = new HttpParams();
    params = params.append('number', number);
    params = params.append('medicationname', medicationname);
    params = params.append('email', email);
    params = params.append('reason', reason);
    params = params.append('reviewer', reviewer);

    return this.httpClient
      .get(this.REST_API_SERVER + 'sendreviewrevise', {
        params: params,
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  sendEmailVerificationRevise(
    number: string,
    medicationname: string,
    email: string,
    reason: string,
    verifier: string
  ) {
    let params = new HttpParams();
    params = params.append('number', number);
    params = params.append('medicationname', medicationname);
    params = params.append('email', email);
    params = params.append('reason', reason);
    params = params.append('verifier', verifier);

    return this.httpClient
      .get(this.REST_API_SERVER + 'sendverificationrevise', {
        params: params,
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  sendEmailVerificationApproved(
    number: string,
    medicationname: string,
    email: string
  ) {
    let params = new HttpParams();
    params = params.append('number', number);
    params = params.append('medicationname', medicationname);
    params = params.append('email', email);

    return this.httpClient
      .get(this.REST_API_SERVER + 'sendverificationapproved', {
        params: params,
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  sendEmailGrantUserAccess(email: string) {
    let params = new HttpParams();
    params = params.append('email', email);
    return this.httpClient
      .get(this.REST_API_SERVER + 'sendEmailGrantUserAccess', {
        params: params,
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  sendAccessRequest(name: string, reason: string, emaillist: any) {
    let params = new HttpParams();
    params = params.append('fullname', name);
    params = params.append('reason', reason);
    params = params.append('emaillist', emaillist);

    return this.httpClient
      .get(this.REST_API_SERVER + 'sendAccessRequestMessage', {
        params: params,
      })
      .pipe(retry(3), catchError(this.handleError));
  }
}
