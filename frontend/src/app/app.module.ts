import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SafehtmlPipe } from './pipes/safehtml.pipe';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { PlaneditComponent } from './plans/edit/edit.component';
import { PlanlistComponent } from './plans/list/list.component';
import { PlandetailComponent } from './plans/detail/detail.component';

import { MeetingdetailComponent } from './meetings/detail/detail.component';
import { MeetingViewComponent } from './meetings/view/view.component';
import { MeetinglistComponent } from './meetings/list/list.component';

import { MedicationsectionComponent } from './partials/medicationsection/medicationsection.component';
import { DisplaysummaryComponent } from './partials/displaysummary/displaysummary.component';
import { DisplaymedicationsectionComponent } from './partials/displaymedicationsection/displaymedicationsection.component';
import { HomepageComponent } from './partials/homepage/homepage.component';
import { NotificationSnackbarComponent } from './partials/notification-snackbar/notification-snackbar.component';
import { AudittrailComponent } from './partials/audittrail/audittrail.component';
import { SearchComponent } from './partials/search/search.component';

import { TopNavComponent } from './navigation/top-nav/top-nav.component';
import { SideNavComponent } from './navigation/side-nav/side-nav.component';
import { MainNavComponent } from './navigation/main-nav/main-nav.component';
import { NavMenuListComponent } from './navigation/nav-menu-list/nav-menu-list.component';

import { DialogSaveMessageComponent } from './dialogs/dialog-save-message/dialog-save-message.component';
import { DialogErrorMessageComponent } from './dialogs/dialog-error-message/dialog-error-message.component';
import { DialogSubmitToMeetingComponent } from './dialogs/dialog-submit-to-meeting/dialog-submit-to-meeting.component';
import { DialogInformationalMessageComponent } from './dialogs/dialog-informational-message/dialog-informational-message.component';
import { DialogLockedStatusMessageComponent } from './dialogs/dialog-locked-status-message/dialog-locked-status-message.component';
import { DialogRejectedMessageComponent } from './dialogs/dialog-rejected-message/dialog-rejected-message.component';
import { DialogReviseMessageComponent } from './dialogs/dialog-revise-message/dialog-revise-message.component';
import { DialogConfirmationMessageComponent } from './dialogs/dialog-confirmation-message/dialog-confirmation-message.component';

import { MailListComponent } from './mail/list/list.component';
import { MailDetailComponent } from './mail/detail/detail.component';
import { MailEditComponent } from './mail/edit/edit.component';

import { BuildQueueListComponent } from './queues/builds/list/list.component';
import { BuildQueueDetailComponent } from './queues/builds/detail/detail.component';
import { ReviewQueueListComponent } from './queues/reviews/list/list.component';
import { ReviewQueueDetailComponent } from './queues/reviews/detail/detail.component';
import { VerificationQueueListComponent } from './queues/verifications/list/list.component';
import { VerificationQueueDetailComponent } from './queues/verifications/detail/detail.component';

import { UserListComponent } from './users/list/list.component';
import { UserEditComponent } from './users/edit/edit.component';
import { UserDetailComponent } from './users/detail/detail.component';
import { RegisterComponent } from './users/register/register.component';

import { ReportsListComponent } from './reports/list/list.component';
import { ProfileComponent } from './users/profile/profile.component';

import config from './app.config';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { SuiModalService, SuiModalModule } from '@giomamaladze/ng2-semantic-ui';
import { ConfirmModalComponent, ConfirmModal } from './modal/confirm.component';
const oktaAuth = new OktaAuth(config.oidc);

@NgModule({
  declarations: [
    AppComponent,
    ConfirmModalComponent,
    DialogErrorMessageComponent,
    DialogSaveMessageComponent,
    DialogSubmitToMeetingComponent,
    DisplaymedicationsectionComponent,
    DisplaysummaryComponent,
    HomepageComponent,
    MedicationsectionComponent,
    MeetingdetailComponent,
    MeetinglistComponent,
    MainNavComponent,
    NavMenuListComponent,
    NotificationSnackbarComponent,
    PlaneditComponent,
    PlanlistComponent,
    PlandetailComponent,
    SafehtmlPipe,
    SideNavComponent,
    TopNavComponent,
    MailListComponent,
    MailDetailComponent,
    MailEditComponent,
    DialogInformationalMessageComponent,
    DialogLockedStatusMessageComponent,
    ReviewQueueListComponent,
    ReviewQueueDetailComponent,
    BuildQueueListComponent,
    BuildQueueDetailComponent,
    VerificationQueueListComponent,
    VerificationQueueDetailComponent,
    DialogRejectedMessageComponent,
    DialogReviseMessageComponent,
    AudittrailComponent,
    UserListComponent,
    UserEditComponent,
    UserDetailComponent,
    DialogConfirmationMessageComponent,
    RegisterComponent,
    SearchComponent,
    ReportsListComponent,
    MeetingViewComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SuiModalModule,
    BrowserAnimationsModule,
    CKEditorModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    OktaAuthModule,
    OktaAuthModule.forRoot({ oktaAuth }),
  ],
  providers: [
    DatePipe,
    {
      provide: OKTA_CONFIG,
      useFactory: () => {
        return {
          oktaAuth,
          onAuthRequired: (oktaAuth: OktaAuth, injector: Injector) => {
            const triggerLogin = async () => {
              await oktaAuth.signInWithRedirect();
            };
            if (
              !oktaAuth.authStateManager.getPreviousAuthState()?.isAuthenticated
            ) {
              // App initialization stage
              triggerLogin();
            } else {
              // Ask the user to trigger the login process during token autoRenew process
              const modalService = injector.get(SuiModalService);
              modalService
                .open(
                  new ConfirmModal(
                    'Do you want to re-authenticate?',
                    'Auth required',
                    'Yes',
                    'No'
                  )
                )
                .onApprove(triggerLogin)
                .onDeny(() => {});
            }
          },
        };
      },
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmModalComponent],
})
export class AppModule {}
