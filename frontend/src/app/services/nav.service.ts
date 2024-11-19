import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>('');

  visible: boolean;
  currentuser = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  private previousPage: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  get viewPreviousPage() {
    return this.previousPage.asObservable();
  }

  updatePreviousPage(pageURL: string) {
    this.previousPage.next(pageURL);
  }

  clearPreviousPage() {
    this.previousPage.next('');
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }

  public clickedNavMenu() {
    this.appDrawer.toggle();
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  toggle() {
    this.visible = !this.visible;
  }

  setCurrentUser(name: string) {
    this.currentuser = name;
  }

  clearCurrentUser() {
    this.currentuser = '';
  }
}
