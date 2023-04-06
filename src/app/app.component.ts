import {Component} from '@angular/core';
import * as packageInfo from '../../package.json';
import {TokenStorageService} from "./services/TokenStorageService";
import {MatDialog} from "@angular/material/dialog";
import {RegisterComponent} from "./routes/authentication/register/register.component";
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
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  currentUserIsAdmin: boolean = false;
  admins = ["Crystalis", "Synha", "darkonatre", "Hai Bang"]

  constructor(private tokenStorageService: TokenStorageService, public dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
    this.loggedUser = this.tokenStorageService.getUser()
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if ((this.loggedUser != null && this.loggedUser !== "")) this.currentUserIsAdmin = this.admins.includes(JSON.parse(this.loggedUser).username)
    //
    // if (this.isLoggedIn) {
    //   const user = this.tokenStorageService.getUser();
    //   this.roles = user.roles;
    //
    //   this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    //   this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
    //
    //   this.username = user.username;
    // }
  }


  logOut(isMobile: boolean = false) {
    this.tokenStorageService.signOut()
    if (!isMobile) {
      this.router.navigate(['/salaries/view1']).then(() =>
        window.location.reload()
      )
    } else {
      this.router.navigate(['/salaries/view2']).then(() =>
        window.location.reload()
      )
    }
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
