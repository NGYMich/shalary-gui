import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-user-input-error-dialog',
  templateUrl: './user-input-error-dialog.component.html',
  styleUrls: ['./user-input-error-dialog.component.css']
})
export class UserInputErrorDialogComponent implements OnInit {
  userInformationError: boolean = false;
  salaryInformationsError: boolean = false;
  salaryInfosForm: any;
  userInformationsForm: any;
  errors: any
  usernameAlreadyExists: any;
  errorMessage: any;
  isApiErrorMessage: any = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,) {
    this.userInformationError = this.data.userInformationError
    this.salaryInformationsError = this.data.salaryInformationsError
    this.usernameAlreadyExists = this.data.usernameAlreadyExists
    this.salaryInfosForm = this.data.salaryInfosForm
    this.userInformationsForm = this.data.userInformationsForm
    this.errorMessage = this.data.errorMessage
    this.isApiErrorMessage = this.data.isApiErrorMessage

    console.log(this.errorMessage)
    this.errors = this.findInvalidControls(this.salaryInfosForm)
  }
  public findInvalidControls(form) {
    let invalid: string[] = [];
  //   let controls = form.controls; // array of 3 formgroup
  //   // console.log("form.controls.controls:" + JSON.stringify(controls))
  // // console.dir(controls)
  //   for (let salaryLine of controls) {
  //     console.dir(salaryLine)
  //     Object.keys(salaryLine.controls).forEach(key => {
  //       console.log(form.get(key).markAsDirty())
  //     });
  //     // for (let salaryLineItem of salaryLine['controls']) {
  //     //   if (salaryLineItem.invalid) {
  //     //     invalid.push("Error at experience " + controls[salaryLine] + ". Field : " + salaryLineItem)
  //     //   }
  //     // }
  //   }
  //   // Object.keys(form.controls).forEach(key => {
  //   //   Object.keys(key).forEach(key => {
  //   //     console.log(form.controls[key])
  //   //   });
  //   // });
  //
  //   // controls.map(control => control.controls).findInvalidControls()
    return invalid;
  }

  ngOnInit(): void {
  }
}
