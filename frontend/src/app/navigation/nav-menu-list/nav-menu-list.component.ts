import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { Observable } from 'rxjs';

import { NavItem } from '../../models/nav-item';

import { UsersService } from '../../services/users.service';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'nav-menu-list',
  templateUrl: './nav-menu-list.component.html',
  styleUrls: ['./nav-menu-list.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class NavMenuListComponent implements OnInit {
  expanded!: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input()
  item!: NavItem;
  @Input() depth: number = 0;

  isLoggedIn$: Observable<boolean>;
  isRole$: Observable<string>;
  isAdmin$: Observable<boolean>;

  constructor(
    public navService: NavService,
    public router: Router,
    private usersService: UsersService
  ) {
    this.isLoggedIn$ = this.usersService.isLoggedIn;
    this.isRole$ = this.usersService.isRole;
    this.isAdmin$ = this.usersService.isAdmin;

    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
      this.navService.closeNav();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  allowedMenuItem(permittedRole: string[]) {
    let roleFound = false;
    this.isRole$.subscribe((roled) => {
      let temproled = roled.toLowerCase();
      permittedRole.forEach((element) => {
        if (element.toLowerCase() === 'all') {
          roleFound = true;
        } else if (element.toLowerCase() === temproled) {
          roleFound = true;
        }
      });
    });
    return roleFound;
  }
}
