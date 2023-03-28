import {Component} from '@angular/core';
import * as packageInfo from '../../package.json';
import {TokenStorageService} from "./services/TokenStorageService";
import {MatDialog} from "@angular/material/dialog";
import {UserInputErrorDialogComponent} from "./user-infos/user-input-error-dialog/user-input-error-dialog.component";
import {RegisterComponent} from "./routes/authentication/register/register.component";
import {LoggedInUserHasSalaryHistoryDirective} from "./routes/global/logged-in-user-has-salary-history-directive";
import {LoginComponent} from "./routes/authentication/login/login.component";
import {Router} from "@angular/router";
import {AppConstants} from "./routes/global/common-variables";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shalary-gui';
  shalaryGuiVersion = packageInfo
  temporaryDisabled = false;
  loggedUser: any = null

  constructor(private tokenStorageService: TokenStorageService, public dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
    this.loggedUser = this.tokenStorageService.getUser()
  }


  logOut() {
    this.tokenStorageService.signOut()
    this.router.navigate(['/salaries/view1']).then(() =>
      window.location.reload()
    )
  }

  openSignupDialog() {
    let dialogRef = this.dialog.open(RegisterComponent, {
      width: AppConstants.SIGN_UP_DIALOG_WIDTH,
      height: AppConstants.SIGN_UP_DIALOG_HEIGHT,
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent, {
      width: AppConstants.LOGIN_DIALOG_WIDTH,
      height: AppConstants.LOGIN_DIALOG_HEIGHT,
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }
}
