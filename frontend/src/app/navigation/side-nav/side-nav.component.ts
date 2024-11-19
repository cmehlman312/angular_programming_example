import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { VERSION } from '@angular/material/core';

import { Observable } from 'rxjs';

import { NavService } from '../../services/nav.service';
import { NavItem } from '../../models/nav-item';

import { UsersService } from '../../services/users.service';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements AfterViewInit {
  @ViewChild('appDrawer')
  appDrawer!: ElementRef;
  version = VERSION;

  isLoggedIn$: Observable<boolean>;
  isRole$: Observable<string>;
  isAdmin$: Observable<boolean>;

  navItems: NavItem[] = [
    {
      displayName: 'Home',
      iconName: '',
      route: '/',
      permissions: ['All'],
    },
    {
      displayName: 'Plans',
      iconName: '',
      route: 'plan',
      permissions: ['All'],
      children: [
        {
          displayName: 'List',
          iconName: '',
          route: 'plan',
          permissions: ['All'],
        },
        {
          displayName: 'Create',
          iconName: '',
          route: 'plan/edit',
          permissions: ['Willow', 'Pharmacist'],
        },
      ],
    },
    {
      displayName: 'Review List',
      iconName: '',
      route: 'review',
      permissions: ['Willow'],
    },
    {
      displayName: 'Meeting List',
      iconName: '',
      route: 'meeting',
      permissions: ['All'],
    },
    {
      displayName: 'Build List',
      iconName: '',
      route: 'build',
      permissions: ['Willow'],
    },
    {
      displayName: 'Verification List',
      iconName: '',
      route: 'verification',
      permissions: ['Pharmacist'],
    },
    {
      displayName: 'Search',
      iconName: '',
      route: 'search',
      permissions: ['All'],
    },
    {
      displayName: 'Reports',
      iconName: '',
      route: 'reports',
      permissions: ['All'],
    },
    {
      displayName: 'Admin',
      iconName: '',
      route: '',
      permissions: ['Willow'],
      children: [
        {
          displayName: 'User',
          iconName: '',
          route: 'user',
          permissions: ['Willow'],
        },
        {
          displayName: 'Mail',
          iconName: '',
          route: 'mail',
          permissions: ['Willow'],
        },
      ],
    },
  ];

  constructor(
    private navService: NavService,
    private usersService: UsersService
  ) {
    this.isLoggedIn$ = this.usersService.isLoggedIn;
    this.isRole$ = this.usersService.isRole;
    this.isAdmin$ = this.usersService.isAdmin;
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  allowedMenuItem(permittedRole: string[]) {
    let roleFound = false;
    this.isRole$.subscribe((roled) => {
      let tempRole = roled.toLowerCase();
      permittedRole.forEach((element) => {
        if (element.toLowerCase() === 'all') {
          roleFound = true;
        } else if (element.toLowerCase() === tempRole) {
          roleFound = true;
        }
      });
    });
    return roleFound;
  }
}
