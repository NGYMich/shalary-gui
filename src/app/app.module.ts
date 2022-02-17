import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {SalariesComponent} from './salaries/salaries.component';
import {DataComponent} from './data/data.component';
import {AboutComponent} from './about/about.component';
import {HttpClientModule} from "@angular/common/http";
import {AgGridModule} from "ag-grid-angular";
import { UserInfosComponent } from './user-infos/user-infos.component';
import { UserInfosDialogComponent } from './user-infos/user-infos-dialog/user-infos-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'salaries', component: SalariesComponent},
  {path: 'data', component: DataComponent},
  {path: 'about', component: AboutComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SalariesComponent,
    DataComponent,
    AboutComponent,
    UserInfosComponent,
    UserInfosDialogComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
