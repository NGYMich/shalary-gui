import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './routes/home/home.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {SalariesComponent} from './routes/salaries/salaries.component';
import {DataComponent} from './routes/data/data.component';
import {AboutComponent} from './routes/about/about.component';
import {HttpClientModule} from "@angular/common/http";
import {AgGridModule} from "ag-grid-angular";
import {UserInfosDialogComponent} from './user-infos/user-infos-dialog/user-infos-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {AddUserDialogComponent} from './user-infos/add-user-dialog/add-user-dialog.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {SalaryCellRenderer} from "./routes/salaries/salary-cell-renderer";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {LocationCellRenderer} from "./routes/salaries/location-cell-renderer";
import {SafePipe} from "./util/SafePipe";
import {EditUserInfosComponent} from './routes/edit-user-infos/edit-user-infos.component';
import {FilterPipe} from "./routes/edit-user-infos/FilterPipe";
import {HighlightDirective} from "./routes/edit-user-infos/HighlightDirective";
import {DeleteUserDialogComponent} from './user-infos/delete-user-dialog/delete-user-dialog.component';
import {CompanyCellRenderer} from "./routes/salaries/company-cell-renderer";
import {TestComponent} from './routes/test/test.component';
import {ActionsButtonsCellRenderer} from "./routes/salaries/action-buttons-cell-renderer";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'salaries', component: SalariesComponent},
  {path: 'data', component: DataComponent},
  {path: 'about', component: AboutComponent},
  {path: 'edit-user-infos', component: EditUserInfosComponent},
  {path: 'test', component: TestComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SalariesComponent,
    DataComponent,
    AboutComponent,
    UserInfosDialogComponent,
    AddUserDialogComponent,
    SalaryCellRenderer,
    LocationCellRenderer,
    CompanyCellRenderer,
    ActionsButtonsCellRenderer,
    SafePipe,
    EditUserInfosComponent,
    FilterPipe,
    HighlightDirective,
    DeleteUserDialogComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    AgGridModule.withComponents([]),
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
