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

@Component({
  selector: 'app-edit-user-infos',
  templateUrl: './edit-user-infos.component.html',
  styleUrls: ['./edit-user-infos.component.css']
})
export class EditUserInfosComponent implements OnInit {
  @ViewChild(WorkHistoryFormComponent, {static: false}) workHistoryFormComponent: WorkHistoryFormComponent;
  @ViewChild(UserInformationsFormComponent, {static: false}) userInformationsFormComponent: UserInformationsFormComponent;

  // Select User to Modify
  users: any;
  usernameSearchControl = new FormControl();
  username = new FormControl()
  password = new FormControl();
  usernameOptions: string[] = [];
  filteredUsernames: Observable<string[]>;

  // Error messages
  isUserLoaded: boolean = false;
  showPasswordError: boolean;
  userInformationError: boolean = false;
  salaryInformationsError: boolean = false;
  usernameAlreadyExist: boolean; //TODO

  // User
  userToModify: User | null = null;

  constructor(
    private formBuilder: FormBuilder, private userService: UserService,
    private locationService: LocationService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    if (this.router.getCurrentNavigation()!.extras!.state != null)
      this.usernameSearchControl.setValue(this.router.getCurrentNavigation()!.extras!.state!['chosenUsernameToEdit'])
  }


  async ngOnInit() {
    await this.loadUsers()
    this.filteredUsernames = this.usernameSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }


  loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.usernameOptions = users.map(user => user.username != null ? user.username : "")
    })
  }

  async retrieveUserWithIdAndPassword($event: any) {
    await this.userService.retrieveUserWithUsernameAndPassword(this.usernameSearchControl.value, this.password.value).subscribe(
      data => {
        console.log('retrieved user ' + this.usernameSearchControl.value + ' with password. User :', JSON.stringify(data))
        // this.isUserLoaded = true;
        this.isUserLoaded = data != null
        this.userToModify = data
        this.showPasswordError = false;

      },
      error => console.log('failed to retrieve user with password', error)
    );
    await this.workHistoryFormComponent.initWorkHistory()
  }


  modifyUser($event: MouseEvent) {
    console.log(this.userInformationsFormComponent)
    let allFormsAreValid = this.userInformationsForm.valid && this.userInformationsFormComponent.countriesControl.valid && this.salaryInfosForm.valid;
    if (allFormsAreValid) {
      this.userService.modifyUser(this.buildModifiedUser()).subscribe((response) => this.redirectToSalariesPage());
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
      lastUpdate: null,
    };
  }

  redirectToSalariesPage() {
    this.router.navigate(['/salaries'])
  }


  deleteUser() {
    this.userService.deleteUser(this.userInformationsForm.get('username')!.value, this.userToModify!.id!);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usernameOptions.filter(option => option.toLowerCase().includes(filterValue));
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
