import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/AuthService";
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, public dialog: MatDialog,) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('submitted!')
    this.authService.register(this.form).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        // window.location.reload()
        setTimeout(() => {
            this.dialog.closeAll()
            let dialogRef = this.dialog.open(LoginComponent, {
              width: '500px',
              height: '550px',
              autoFocus: false,
              panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
            });
          }
          , 1500)

      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
