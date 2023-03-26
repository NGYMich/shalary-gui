import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../services/UserService";
import {User} from "../../model/user";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {LocationService} from "../../services/LocationService";
import {MatDialog} from "@angular/material/dialog";
import {DeleteUserDialogComponent} from "../../user-infos/delete-user-dialog/delete-user-dialog.component";
import {Router} from "@angular/router";
import {WorkHistoryFormComponent} from "../global/user-infos/work-history-form/work-history-form-component";
import {UserInformationsFormComponent} from "../global/user-infos/user-informations-form/user-informations-form-component";
import {UserInputErrorDialogComponent} from "../../user-infos/user-input-error-dialog/user-input-error-dialog.component";
import {TokenStorageService} from "../../services/TokenStorageService";

@Component({
  selector: 'app-edit-user-infos',
  templateUrl: './edit-user-infos.component.html',
  styleUrls: ['./edit-user-infos.component.css']
})
export class EditUserInfosComponent implements OnInit {
  @ViewChild(WorkHistoryFormComponent, {static: false}) workHistoryFormComponent: WorkHistoryFormComponent;
  @ViewChild(UserInformationsFormComponent, {static: false}) userInformationsFormComponent: UserInformationsFormComponent;



  // Error messages
  isUserLoaded: boolean = false;


  // User
  userToModify: any | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private locationService: LocationService,
    public dialog: MatDialog,
    private router: Router,
    private tokenStorageService: TokenStorageService,
  ) {

  }


  ngOnInit() {
    this.userService.getUserById(this.tokenStorageService.getUser().id).subscribe(user => {
        this.userToModify = user
      }
    )
  }

  modifyUser($event: MouseEvent) {
    let allFormsAreValid = this.userInformationsForm.valid && this.userInformationsFormComponent.countriesControl.valid && this.salaryInfosForm.valid;
    if (allFormsAreValid) {
      let user = this.buildModifiedUser();
      console.dir(user)

      this.userService.modifyUser(user).subscribe((response) => this.redirectToSalariesPage());
    } else {
      this.openUserInputErrorDialog(
        !this.salaryInfosForm.valid,
        !this.userInformationsForm.valid || !this.userInformationsFormComponent.countriesControl.valid,
        this.userInformationsForm,
        this.salaryInfosForm
      )
    }
  }

  private buildModifiedUser() {
    return {
      id: this.userToModify!.id,
      email: this.userInformationsForm.get('email')!.value,
      password: this.userInformationsForm.get('password') != null ? this.userInformationsForm.get('password')!.value : null,
      username: this.userInformationsForm.get('username')!.value,

      mainSector: null,
      location: this.userInformationsFormComponent.countriesControl.value,
      locationImage: null,
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

      createdDate: null,
      modifiedDate: null,
      provider: null,
      thumbsUp: null,
      thumbsDown: null,

      validated: true,
    };
  }

  redirectToSalariesPage() {
    this.router.navigate(['/salaries/view1'])
  }


  deleteUser() {
    this.userService.deleteUser(this.userInformationsForm.get('username')!.value, this.userToModify!.id!);
  }

  openUserInputErrorDialog(salaryInformationsError, userInformationError, userInformationsForm, salaryInfosForm) {
    let dialogRef = this.dialog.open(UserInputErrorDialogComponent, {
      width: '200',
      height: '200',
      data: {
        userInformationError: userInformationError,
        salaryInformationsError: salaryInformationsError,
        userInformationsForm: userInformationsForm,
        salaryInfosForm: salaryInfosForm,
      },
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }

  openDeleteUserDialog($event: MouseEvent) {
    let dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
    dialogRef.componentInstance.onDeleteUser.subscribe(async () => {
      await this.deleteUser()
      dialogRef.close()
      location.reload()
    });// subscription on close

    dialogRef.componentInstance.cancelUserDeleteEvent.subscribe(() => {
      dialogRef.close()
    })

    dialogRef.afterClosed()
      .subscribe(() => {
      })
  }

  // Getters & setters

  get salaryInfosForm(): FormArray {
    return this.workHistoryFormComponent.salaryInfos;
  }

  get userInformationsForm(): FormGroup {
    return this.userInformationsFormComponent.userInformationsForm;
  }

}
