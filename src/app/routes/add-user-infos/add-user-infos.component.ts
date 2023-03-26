import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../services/UserService";
import {LocationService} from "../../services/LocationService";
import {User} from "../../model/user";
import {Router} from "@angular/router";
import {GlobalService} from "../global/global.service";
import {WorkHistoryFormComponent} from "../global/user-infos/work-history-form/work-history-form-component";
import {UserInformationsFormComponent} from "../global/user-infos/user-informations-form/user-informations-form-component";
import {UserInputErrorDialogComponent} from "../../user-infos/user-input-error-dialog/user-input-error-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-add-user-infos',
  templateUrl: './add-user-infos.component.html',
  styleUrls: ['./add-user-infos.component.css']
})
export class AddUserInfosComponent implements OnInit, OnDestroy {
  @ViewChild(WorkHistoryFormComponent, {static: false}) workHistoryFormComponent: WorkHistoryFormComponent;
  @ViewChild(UserInformationsFormComponent, {static: false}) userInformationsFormComponent: UserInformationsFormComponent;

  isUserAdded: boolean;
  userInformationError: boolean = false;
  salaryInformationsError: boolean = false;
  usernameAlreadyExists: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private locationService: LocationService,
    private router: Router,
    private globalService: GlobalService,
    public dialog: MatDialog,
  ) {
  }


  ngOnInit(): void {
    // if (this.globalService.addUser_UserInformationsForm) {
    //   this.userInformationsFormComponent.userInformationsForm = this.globalService.addUser_UserInformationsForm;
    // }
    // if (this.globalService.addUser_SalaryInfosForm) {
    //   this.workHistoryFormComponent.salaryInfosForm = this.globalService.addUser_SalaryInfosForm;
    // }
  }

  ngOnDestroy() {
    // this.globalService.addUser_UserInformationsForm = this.userInformationsForm;
    // this.globalService.addUser_SalaryInfosForm = this.salaryInfosForm;
  }

  async addUser($event: MouseEvent) {
    this.userService.getUsers().subscribe(async (users: User[]) => {
      this.usernameAlreadyExists = users.filter(user => user.username == this.userInformationsForm.get('username')!.value).length != 0;
      let allFormsAreValid = this.userInformationsForm.valid && this.userInformationsFormComponent.countriesControl.valid && this.salaryInfosForm.valid && !this.usernameAlreadyExists;
      if (allFormsAreValid) {
        await this.userService.addUser(this.buildUser()).subscribe((response) => {
          this.setErrorMessages(true, false, false);
          this.redirectToSalariesPage()
        });

      } else {
        // this.userInformationsForm.markAsTouched()
        // this.salaryInfosForm.markAsTouched()
        this.openUserInputErrorDialog()
      }
    })
  }

  openUserInputErrorDialog() {
    let dialogRef = this.dialog.open(UserInputErrorDialogComponent, {
      width: '200',
      height: '200',
      data: {
        userInformationError: !this.userInformationsForm.valid || !this.userInformationsFormComponent.countriesControl.valid,
        salaryInformationsError: !this.salaryInfosForm.valid,
        userInformationsForm: this.userInformationsForm,
        salaryInfosForm: this.salaryInfosForm,
        usernameAlreadyExists: this.usernameAlreadyExists
      },
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }

  redirectToSalariesPage() {
    this.router.navigate(['/salaries/view1'])
  }

  private setErrorMessages(isUserAdded, salaryInformationsError, userInformationError) {
    this.isUserAdded = isUserAdded;
    this.salaryInformationsError = salaryInformationsError;
    this.userInformationError = userInformationError;
  }

  private buildUser() {
    return {
      id: null,
      locationImage: null,
      validated: true,
      username: this.userInformationsForm.get('username')!.value,
      password: this.userInformationsForm.get('password')!.value,
      mail: this.userInformationsForm.get('mail')!.value,
      mainSector: null,
      location: this.userInformationsFormComponent.countriesControl.value,
      city: this.userInformationsForm.get('city')!.value,
      education: this.userInformationsForm.get('education')!.value,
      age: this.userInformationsForm.get('age')!.value,
      gender: this.userInformationsForm.get('gender')!.value,
      comment: this.userInformationsForm.get('comment')!.value,
      salaryHistory: {
        id: null,
        salaryCurrency: this.userInformationsForm.get('currency')!.value,
        totalYearsOfExperience: this.userInformationsForm.get('yearsOfExperience')!.value,
        salaryInfos: this.salaryInfosForm.value
      },
      lastUpdate: null
    };
  }

  // Getters & setters

  get salaryInfosForm(): FormArray {
    return this.workHistoryFormComponent.salaryInfos;
  }

  get userInformationsForm(): FormGroup {
    return this.userInformationsFormComponent.userInformationsForm;
  }

}
