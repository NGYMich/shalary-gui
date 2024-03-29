import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../../services/AuthService";
import {AppConstants} from "../../global/common-variables";
import {UserService} from "../../../services/UserService";
import {TokenStorageService} from "../../../services/TokenStorageService";
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RegisterComponent} from "../register/register.component";
import {DeviceDetectorService} from "ngx-device-detector";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentUser: any;
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;
  githubURL = AppConstants.GITHUB_AUTH_URL;
  linkedinURL = AppConstants.LINKEDIN_AUTH_URL;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  userInformationsForm: FormGroup = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });
  showPassword: boolean;
  @ViewChild('email') email: ElementRef;

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private deviceService: DeviceDetectorService,
  ) {
  }

  ngOnInit(): void {
    const token: string | null = this.route.snapshot.queryParamMap.get('token');
    const error: string | null = this.route.snapshot.queryParamMap.get('error');
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.currentUser = this.tokenStorage.getUser();
    } else if (token) {
      this.tokenStorage.saveToken(token);
      this.userService.getCurrentUser().subscribe(
        data => {
          this.login(data);
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    } else if (error) {
      this.errorMessage = error;
      this.isLoginFailed = true;
    }
  }

  ngAfterViewInit(): void {
    this.email.nativeElement.focus()
  }

  onSubmit(): void {
    console.log(this.userInformationsForm.value)
    this.authService.login(this.userInformationsForm.value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.login(data.user);
      },
      err => {
        console.log('error during onSubtmi() ', err.error.message)
        this.errorMessage = err.error.status == 401 ? "Wrong username or password" : err.error.error;
        this.isLoginFailed = true;
      }
    );
  }

  login(user): void {
    this.tokenStorage.saveUser(user);
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    this.currentUser = this.tokenStorage.getUser();
    this.tokenStorage.saveHasSalaryHistory(JSON.stringify(this.currentUser.hasSalaryHistory || this.currentUser.salaryHistory != null))

    console.log(this.tokenStorage.getUser())

    if (!this.tokenStorage.getHasSalaryHistory()) {
      this.dialog.closeAll()
      this.router.navigate(['/edit-user-infos'])
        .then(
          () => {
            window.location.reload()
            console.log('has salary history, grats')

          })
    } else {
      if (this.tokenStorage.getToken() != null && this.tokenStorage.getToken() != '' && this.deviceService.isMobile()) {
        this.router.navigate(['/careers/data-view']).then(() =>
          window.location.reload()
        )
      } else {
        this.router.navigate(['/careers/graphical-view']).then(() =>
          window.location.reload()
        )
      }
    }
  }

  redirectToSignup() {
    this.dialog.closeAll()
    this.dialog.open(RegisterComponent, {
      width: AppConstants.SIGN_UP_DIALOG_WIDTH,
      height: AppConstants.SIGN_UP_DIALOG_HEIGHT,
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
