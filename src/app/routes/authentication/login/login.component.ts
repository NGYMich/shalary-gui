import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../../services/AuthService";
import {AppConstants} from "../../global/common-variables";
import {UserService} from "../../../services/UserService";
import {TokenStorageService} from "../../../services/TokenStorageService";
import {MatDialog} from "@angular/material/dialog";


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

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private dialog: MatDialog) {
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

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.login(data.user);
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  login(user): void {
    this.tokenStorage.saveUser(user);
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    this.currentUser = this.tokenStorage.getUser();
    let hasSalaryHistory = this.currentUser.salaryHistory != null
    this.tokenStorage.saveHasSalaryHistory(JSON.stringify(hasSalaryHistory))
    console.log(hasSalaryHistory)


    console.dir(this.tokenStorage.getHasSalaryHistory())
    if (!this.tokenStorage.getHasSalaryHistory()) {
      this.dialog.closeAll()
      this.router.navigate(['/edit-user-infos'])
        .then(() => window.location.reload())
    } else {
      window.location.reload()
    }


    // setTimeout(() =>), 3000 )
  }

}
