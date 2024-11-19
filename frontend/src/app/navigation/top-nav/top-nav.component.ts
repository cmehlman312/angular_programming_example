import { Component, OnInit, Inject, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { NavService } from '../../services/nav.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  isAuthenticated: boolean = false;
  error: Error | null = null;
  userName: string = '';

  constructor(
    public navService: NavService,
    private usersService: UsersService,
    private _router: Router,
    @Inject(OKTA_AUTH) public oktaAuth: OktaAuth
  ) {
    this.isLoggedIn$ = this.usersService.isLoggedIn;
  }

  ngOnInit(): void {}

  async logout() {
    this.usersService.logout();
    await this.oktaAuth.signOut();
  }

  async login() {
    try {
      if (isDevMode()) {
        // Development
        this.usersService.loginDev();
        this._router.navigate(['login/register']);
      } else {
        // Production
        await this.oktaAuth.signInWithRedirect({
          originalUri: '/login/register',
        });
      }
    } catch (err) {
      console.error(err);
      this.error = err as Error;
    }
  }
}
