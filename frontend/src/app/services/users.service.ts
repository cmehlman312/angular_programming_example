import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { retry, catchError, takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../environments/environment';

import { User } from '../models/user';

import { NavService } from '../services/nav.service';

export interface AccessRequest {
  requestreason: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnDestroy {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();
  private API_SERVER = environment.apiUrl;
  private REST_API_SERVER = this.API_SERVER + '/api/user/';

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private admin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private role: BehaviorSubject<string> = new BehaviorSubject<string>(
    'View Only'
  );

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get isRole() {
    return this.role.asObservable();
  }

  get isAdmin() {
    return this.admin.asObservable();
  }

  userInformationChange: Subject<boolean> = new Subject<boolean>();
  userInfo: any = [];

  constructor(
    private httpClient: HttpClient,
    public dialog: MatDialog,
    private navService: NavService,
    private _router: Router
  ) {
    this.userInformationChange
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        this.userInfo = value;
      });
  }

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

  getUserList(): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER)
      .pipe(retry(3), catchError(this.handleError));
  }

  getUserById(id: string): Observable<any> {
    return this.httpClient
      .get<any>(this.REST_API_SERVER + id)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateUser(id: string, user: any): Observable<User> {
    return this.httpClient
      .put<User>(
        this.REST_API_SERVER + id,
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  grantAccess(id: string, grantedFields: any): Observable<User> {
    return this.httpClient
      .put<User>(
        this.REST_API_SERVER + 'grantaccess/' + id,
        JSON.stringify(grantedFields),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  revokeAccess(id: string, revokeFields: any): Observable<User> {
    return this.httpClient
      .put<User>(
        this.REST_API_SERVER + 'revokeaccess/' + id,
        JSON.stringify(revokeFields),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getUserEmailInformation(userList: any): Observable<User> {
    let params = new HttpParams();
    params = params.append('users', userList.join(', '));

    return this.httpClient
      .get<User>(this.REST_API_SERVER + 'emailinformation', { params: params })
      .pipe(retry(3), catchError(this.handleError));
  }

  updateUserInformation(userData: any) {
    this.userInformationChange.next(userData);
  }

  getUserInformation(userid: string): Observable<User> {
    return this.httpClient
      .get<User>(this.REST_API_SERVER + 'userinformation/' + userid)
      .pipe(retry(3), catchError(this.handleError));
  }

  createNewUser(userInfo: any): Observable<User> {
    return this.httpClient
      .post<User>(
        this.REST_API_SERVER,
        JSON.stringify(userInfo),
        this.httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getAdminEmailList(): Observable<User> {
    return this.httpClient
      .get<User>(this.REST_API_SERVER + 'adminemaillist/')
      .pipe(retry(3), catchError(this.handleError));
  }

  checkLoggedInStatus() {
    return this.isLoggedIn;
  }

  updateLoggedInStatus() {
    this.loggedIn.next(true);
  }
  updateLoggedOutStatus() {
    this.loggedIn.next(false);
  }
  login() {
    this.updateLoggedInStatus();
    let dummyInfo = {
      firstname: 'FirstName_goes_here',
      lastname: 'LastName_goes_here',
      fullname: 'FullName_goes_here',
    };
    this.updateUserInformation(dummyInfo);
  }

  logout() {
    this.updateLoggedOutStatus();
    this.updateUserInformation('');
    this.navService.clearCurrentUser();
    // this.tokenmanagerService.deleteAllItems();
    this._router.navigate(['/']);
    return true;
  }

  logoutForExpiredToken() {
    // this.tokenmanagerService.removeToken();
    // this.tokenmanagerService.alertExpiredToken();
    this.updateLoggedOutStatus();
    this.updateUserInformation('');
    this.navService.clearCurrentUser();
    this._router.navigate(['/']);
    return true;
  }

  updateRoles(role: string, admin: boolean) {
    this.role.next(role);
    this.admin.next(admin);
  }

  loginDev() {
    this.updateLoggedInStatus();
    let dummyInfo = {
      firstname: 'FirstName_goes_here',
      lastname: 'LastName_goes_here',
      fullname: 'FullName_goes_here',
    };
    this.updateUserInformation(dummyInfo);
  }
}
