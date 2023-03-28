import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/AuthService";
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../login/login.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppConstants} from "../../global/common-variables";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;
  githubURL = AppConstants.GITHUB_AUTH_URL;
  linkedinURL = AppConstants.LINKEDIN_AUTH_URL;
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  matchingPasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  userInformationsForm: FormGroup = new FormGroup({
    username: this.usernameFormControl,
    email: this.emailFormControl,
    password: this.passwordFormControl,
    matchingPassword: this.matchingPasswordFormControl
  });

  showPassword: boolean;
  showMatchingPassword: boolean;

  constructor(private authService: AuthService, public dialog: MatDialog,) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {

    console.log(this.userInformationsForm)
    console.log(this.matchingPasswordFormControl)
    this.authService.register(this.userInformationsForm.value).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        setTimeout(() => {
            this.dialog.closeAll()
            let dialogRef = this.dialog.open(LoginComponent, {
              width: AppConstants.LOGIN_DIALOG_WIDTH,
              height: AppConstants.LOGIN_DIALOG_HEIGHT,
              autoFocus: false,
              panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
            });
          }
          , 1500)

      },
      err => {
        console.log(err.error.message)
        this.errorMessage = err.error.message.includes("match") ? "Passwords do not match." : err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleMatchingPasswordVisibility(): void {
    console.log(this.matchingPasswordFormControl)
    this.showMatchingPassword = !this.showMatchingPassword;
  }

  redirectToLogin() {
    this.dialog.closeAll()
    this.dialog.open(LoginComponent, {
      width: AppConstants.LOGIN_DIALOG_WIDTH,
      height: AppConstants.LOGIN_DIALOG_HEIGHT,
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }
}
