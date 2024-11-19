import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OktaCallbackComponent } from '@okta/okta-angular';

import { HomepageComponent } from './partials/homepage/homepage.component';
import { PlandetailComponent } from './plans/detail/detail.component';
import { PlaneditComponent } from './plans/edit/edit.component';
import { PlanlistComponent } from './plans/list/list.component';
import { MeetinglistComponent } from './meetings/list/list.component';
import { MeetingdetailComponent } from './meetings/detail/detail.component';
import { MailListComponent } from './mail/list/list.component';
import { MailDetailComponent } from './mail/detail/detail.component';
import { MailEditComponent } from './mail/edit/edit.component';
import { ReviewQueueListComponent } from './queues/reviews/list/list.component';
import { ReviewQueueDetailComponent } from './queues/reviews/detail/detail.component';
import { BuildQueueListComponent } from './queues/builds/list/list.component';
import { BuildQueueDetailComponent } from './queues/builds/detail/detail.component';
import { VerificationQueueListComponent } from './queues/verifications/list/list.component';
import { VerificationQueueDetailComponent } from './queues/verifications/detail/detail.component';
import { UserListComponent } from './users/list/list.component';
import { UserEditComponent } from './users/edit/edit.component';
import { UserDetailComponent } from './users/detail/detail.component';
import { RegisterComponent } from './users/register/register.component';
import { SearchComponent } from './partials/search/search.component';
import { ReportsListComponent } from './reports/list/list.component';
import { MeetingViewComponent } from './meetings/view/view.component';
import { ProfileComponent } from './users/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'plan/detail/:id', component: PlandetailComponent },
  { path: 'plan/edit/:id', component: PlaneditComponent },
  { path: 'plan/copy/:id', component: PlaneditComponent },
  { path: 'plan/edit', component: PlaneditComponent },
  { path: 'plan', component: PlanlistComponent },
  { path: 'meeting/detail/:meetingdate', component: MeetingdetailComponent },
  { path: 'meeting/view/:meetingdate', component: MeetingViewComponent },
  { path: 'meeting', component: MeetinglistComponent },
  { path: 'mail/detail/:id', component: MailDetailComponent },
  { path: 'mail/edit/:id', component: MailEditComponent },
  { path: 'mail/edit', component: MailEditComponent },
  { path: 'mail', component: MailListComponent },
  { path: 'review/detail/:id', component: ReviewQueueDetailComponent },
  { path: 'review', component: ReviewQueueListComponent },
  { path: 'build/detail/:id', component: BuildQueueDetailComponent },
  { path: 'build', component: BuildQueueListComponent },
  {
    path: 'verification/detail/:id',
    component: VerificationQueueDetailComponent,
  },
  { path: 'verification', component: VerificationQueueListComponent },
  { path: 'user/edit/:id', component: UserEditComponent },
  { path: 'user/detail/:id', component: UserDetailComponent },
  { path: 'user/profile', component: ProfileComponent },
  { path: 'user', component: UserListComponent },
  { path: 'login/register', component: RegisterComponent },
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'logout', redirectTo: '/home', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'reports', component: ReportsListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
