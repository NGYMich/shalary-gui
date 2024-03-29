import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './routes/home/home.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {CareersDataViewComponent} from './routes/careers/careers-data-view/careers-data-view.component';
import {DataComponent} from './routes/data/data.component';
import {AboutComponent} from './routes/about/about.component';
import {HttpClientModule} from "@angular/common/http";

import {UserInfosDialogComponent} from './user-infos/user-infos-dialog/user-infos-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {SalaryCellRenderer} from "./routes/careers/cell-renderers/salary-cell-renderer";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {LocationCellRenderer} from "./routes/careers/cell-renderers/location-cell-renderer";
import {SafePipe} from "./util/SafePipe";
import {EditUserInfosComponent} from './routes/edit-user-infos/edit-user-infos.component';
import {FilterPipe} from "./routes/edit-user-infos/FilterPipe";
import {HighlightDirective} from "./routes/edit-user-infos/HighlightDirective";
import {DeleteUserDialogComponent} from './user-infos/delete-user-dialog/delete-user-dialog.component';
import {CompanyCellRenderer} from "./routes/careers/cell-renderers/company-cell-renderer";
import {TestComponent} from './routes/test/test.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {JobCellRenderer} from "./routes/careers/cell-renderers/job-cell-renderer";
import {IsMobileDirective} from "./routes/global/is-mobile-directive";
import {IsNotMobileDirective} from "./routes/global/is-not-mobile-directive";
import {CustomTooltip} from "./routes/careers/cell-renderers/custom-tooltip.component";
import {WorkHistoryFormComponent} from './routes/edit-user-infos/work-history-form/work-history-form-component';
import {UserInformationsFormComponent} from './routes/edit-user-infos/user-informations-form/user-informations-form-component';
import {UserInputErrorDialogComponent} from './user-infos/user-input-error-dialog/user-input-error-dialog.component';
import {CareersGraphicalView} from './routes/careers/careers-graphical-view/careers-graphical-view';
import {JobCellRendererAlternativeView} from "./routes/careers/cell-renderers/job-cell-renderer-alternative-view";
import {CompanyCellRendererAlternativeView} from "./routes/careers/cell-renderers/company-cell-renderer-alternative-view";
import {MatMenuModule} from "@angular/material/menu";
import {AuthenticationComponent} from './routes/authentication/authentication.component';
import {LoginComponent} from './routes/authentication/login/login.component';
import {RegisterComponent} from './routes/authentication/register/register.component';
import {ProfileComponent} from './routes/authentication/profile/profile.component';
import {BoardUserComponent} from './routes/authentication/board-user/board-user.component';
import {BoardAdminComponent} from './routes/authentication/board-admin/board-admin.component';
import {BoardModeratorComponent} from './routes/authentication/board-moderator/board-moderator.component';
import {IsLoggedInDirective} from "./routes/global/is-logged-in-directive";
import {IsNotLoggedInDirective} from "./routes/global/is-not-logged-in-directive";
import {LoggedInUserHasNoSalaryHistoryDirective} from "./routes/global/logged-in-user-has-no-salary-history-directive";
import {LoggedInUserHasSalaryHistoryDirective} from "./routes/global/logged-in-user-has-salary-history-directive";
import {FaqComponent} from './routes/faq/faq.component';
import {authInterceptorProviders} from "./services/AuthInterceptor";
import {ArticlesComponent} from './routes/articles/articles.component';
import {CookieService} from 'ngx-cookie-service';
import {OpenCloseComponent} from './animations/open-close/open-close.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AgGridModule} from "ag-grid-angular";
import {TipsAndTricksDialogComponent} from './user-infos/tips-and-tricks-dialog/tips-and-tricks-dialog.component';
import {UserFeedbacksComponent} from './routes/user-feedbacks/user-feedbacks.component';
import { SalariesComponent } from './routes/salaries/salaries.component';
import {SelectAllOptionComponent} from "./routes/salaries/select-all-option/select-all-option.component";
import {MatRippleModule} from "@angular/material/core";

const routes: Routes = [
  {path: 'home', component: HomeComponent},

  {path: 'careers/data-view', component: CareersDataViewComponent},
  {path: 'careers/graphical-view', component: CareersGraphicalView},

  {path: 'data', component: DataComponent},
  {path: 'articles', component: ArticlesComponent},
  {path: 'faq', component: FaqComponent},
  {path: 'about', component: AboutComponent},
  {path: 'edit-user-infos', component: EditUserInfosComponent},

  {path: 'user-feedbacks', component: UserFeedbacksComponent},
  {path: 'test', component: TestComponent},

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  // redirect
  {path: 'salaries', component: SalariesComponent},
  {path: '**', component: CareersGraphicalView},

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CareersDataViewComponent,
    DataComponent,
    AboutComponent,
    UserInfosDialogComponent,
    SalaryCellRenderer,
    JobCellRenderer,
    JobCellRendererAlternativeView,
    CompanyCellRendererAlternativeView,
    LocationCellRenderer,
    CompanyCellRenderer,
    SafePipe,
    EditUserInfosComponent,
    FilterPipe,
    HighlightDirective,
    DeleteUserDialogComponent,
    TestComponent,
    IsMobileDirective,
    IsNotMobileDirective,
    CustomTooltip,
    WorkHistoryFormComponent,
    UserInformationsFormComponent,
    UserInputErrorDialogComponent,
    CareersGraphicalView,
    AuthenticationComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    BoardUserComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    IsLoggedInDirective,
    IsNotLoggedInDirective,
    LoggedInUserHasNoSalaryHistoryDirective,
    LoggedInUserHasSalaryHistoryDirective,
    FaqComponent,
    ArticlesComponent,
    OpenCloseComponent,
    TipsAndTricksDialogComponent,
    UserFeedbacksComponent,
    SalariesComponent,
    SelectAllOptionComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    AgGridModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatRippleModule,

  ],
  providers: [authInterceptorProviders, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
