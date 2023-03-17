import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/UserService";
import {User} from "../model/user";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {LocationService} from "../services/LocationService";
import {Country} from "../model/country";
import {MatDialog} from "@angular/material/dialog";
import {DeleteUserDialogComponent} from "../user-infos/delete-user-dialog/delete-user-dialog.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-user-infos',
  templateUrl: './edit-user-infos.component.html',
  styleUrls: ['./edit-user-infos.component.css']
})
export class EditUserInfosComponent implements OnInit {

  users: any;
  searchText = '';
  usernameSearchControl = new FormControl();
  username = new FormControl()
  password = new FormControl();

  options: string[] = [];
  filteredOptions: Observable<string[]>;

  // user infos
  userInformationsForm: FormGroup;

  //salary infos & history
  salaryInfosForm: FormGroup;
  salaryHistoryForm: FormGroup;
  // countries
  countriesControl = new FormControl("", (Validators.required))
  filteredCountries: Observable<Country[]>;
  // jobLevels = ['Intern', 'Apprentice', 'Junior', 'Intermediate', 'Senior'];
  currencies = ['EUR (€)', 'USD ($)', 'GBP (£)', 'JPY (¥)', 'CHF (₣)', 'AUD (AU$)', 'CAD (C$)'];
  educationLevels = ['Bootcamp', 'High School Graduate', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate Degree', 'Other']
  selectedGender;
  selectedCurrency;
  selectedEducation;
  isUserAdded: boolean;
  userInformationError: boolean = false;
  salaryInformationsError: boolean = false;
  allCountriesWithTheirFlags: any;
  countriesOptions: any;
  userToModify: User | null = null;
  isUserLoaded: boolean = false;
  chosenUsernameToEdit: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private locationService: LocationService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    if (this.router.getCurrentNavigation()!.extras!.state != null) this.usernameSearchControl.setValue(this.router.getCurrentNavigation()!.extras!.state!['chosenUsernameToEdit'])

  }

  // getters & setters
  showPasswordError: boolean;
  private shouldDelete: boolean;

  get salaryInfos(): FormArray {
    return this.salaryInfosForm.get('salaryInfos') as FormArray;
  }

  ngOnInit() {
    this.loadUsers()
    this.filteredOptions = this.usernameSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.options = users.map(user => user.username != null ? user.username : "")
    })
  }

  retrieveUserWithIdAndPassword($event: any) {
    let selectedUser = this.users.filter(user => user.username == this.usernameSearchControl.value)[0]

    this.userToModify = this.userService.retrieveUserWithUsernameAndPassword(this.usernameSearchControl.value, this.password.value).subscribe(
      data => {
        console.log('retrieved user ' + this.usernameSearchControl.value + ' with password. User :', JSON.stringify(data))
        this.userToModify = data;
        this.initSalaryInfosForm();
        this.initUserInformationsForm();
        this.initWorkHistory();
        this.countriesControl = new FormControl(this.userToModify?.location, (Validators.required))
        this.locationService.getCountriesWithFlags().subscribe((data: Country[]) => {
          this.allCountriesWithTheirFlags = data
          // console.log("countries :", this.allCountriesWithTheirFlags);
          // console.log(this.allCountriesWithTheirFlags.slice())
          // this.countriesOptions = this.allCountriesWithTheirFlags.map(country => country.states.map(state => state + ", " + country.name)).unique
          this.filteredCountries = this.countriesControl.valueChanges
            .pipe(
              startWith(''),
              map(country => country ? this._filterCountries(country) : this.allCountriesWithTheirFlags.slice()),
            );
          if (this.userToModify != null) {
            console.log("user to modify not null")
            this.isUserLoaded = true;
            this.showPasswordError = false;
          } else {
            console.log("user to modify null")
            this.isUserLoaded = false;
            this.showPasswordError = true;
          }
        })
      },
      error => console.log('failed to retrieve user with password', error)
    );


  }

  addNewJobFormLine() {
    let lastSalaryInfo = this.salaryInfos.controls[this.salaryInfos.controls.length - 1]
    console.log(lastSalaryInfo)
    let controlsConfig = {
      yearsOfExperience: new FormControl(lastSalaryInfo.get('yearsOfExperience')?.value, Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
      jobName: new FormControl(lastSalaryInfo.get('jobName')?.value, Validators.required),
      baseSalary: new FormControl(lastSalaryInfo.get('baseSalary')?.value, Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
      stockSalary: new FormControl(lastSalaryInfo.get('stockSalary')?.value),
      bonusSalary: new FormControl(lastSalaryInfo.get('bonusSalary')?.value),
      totalSalary: new FormControl(''),
      company: this.formBuilder.group({
        name: lastSalaryInfo.get('company')?.value.name,
        sector: lastSalaryInfo.get('company')?.value.sector
      }),
    }
    this.salaryInfos.push(this.formBuilder.group(controlsConfig))
  }

  removeJobFormLine(pointIndex) {
    this.salaryInfos.removeAt(pointIndex);
  }

  calculateTotalSalary(pointIndex) {
    let totalSalary: number = 0;
    let currentJob = this.salaryInfos.value[pointIndex]!;
    if (currentJob.baseSalary == '' && currentJob.bonusSalary == '' && currentJob.bonusSalary == '') {
      return 'Total Salary'
    } else {
      if (currentJob.baseSalary !== '') totalSalary += parseFloat(currentJob.baseSalary);
      if (currentJob.bonusSalary !== '') totalSalary += parseFloat(currentJob.bonusSalary);
      if (currentJob.stockSalary !== '') totalSalary += parseFloat(currentJob.stockSalary);
    }
    return totalSalary
  }

  addUser($event: MouseEvent) {
    if (this.userInformationsForm.valid) {
      if (this.salaryInfos.valid) {
        this.userService.modifyUser({
          id: this.userToModify!.id,
          locationImage: null,
          validated: true,
          username: this.userInformationsForm.get('username')!.value,
          password: this.userInformationsForm.get('password')!.value,
          mail: this.userInformationsForm.get('mail')!.value,
          mainSector: null,
          location: this.countriesControl.value,
          education: this.userInformationsForm.get('education')!.value,
          age: this.userInformationsForm.get('age')!.value,
          gender: this.userInformationsForm.get('gender')!.value,
          comment: this.userInformationsForm.get('comment')!.value,
          salaryHistory: {
            id: null,
            // id: this.userToModify!.salaryHistory?.id,
            salaryCurrency: this.userInformationsForm.get('currency')!.value,
            totalYearsOfExperience: this.userInformationsForm.get('yearsOfExperience')!.value,
            salaryInfos: this.salaryInfos.value
          },
          lastUpdate: null,
        });
        this.isUserAdded = true;
        this.salaryInformationsError = false;
        this.userInformationError = false;
      } else {
        this.isUserAdded = false;
        this.salaryInformationsError = true;
        this.userInformationError = false;
      }
    } else {
      this.isUserAdded = false;
      this.salaryInformationsError = false;
      this.userInformationError = true;
    }
  }

  deleteUser() {
    this.userService.deleteUser(this.userInformationsForm.get('username')!.value, this.userToModify!.id!);
  }

  private _filterCountries(value): Country[] {
    const filterValue = value.toLowerCase();
    return this.allCountriesWithTheirFlags.filter(country => country.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private initWorkHistory() {
    this.userToModify?.salaryHistory?.salaryInfos?.forEach(
      salaryInfo => this.salaryInfos.push(this.formBuilder.group({
            // id: new FormControl(salaryInfo.id),
            yearsOfExperience: new FormControl(salaryInfo.yearsOfExperience, Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
            jobName: new FormControl(salaryInfo.jobName, Validators.required),
            baseSalary: new FormControl(salaryInfo.baseSalary, Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
            stockSalary: new FormControl(salaryInfo.stockSalary),
            bonusSalary: new FormControl(salaryInfo.bonusSalary),
            totalSalary: '',
            company: this.formBuilder.group({
              // id: new FormControl(salaryInfo.company.id),
              name: salaryInfo.company.name,
              sector: salaryInfo.company.sector
            }),
          }
        )
      )
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private initUserInformationsForm() {
    this.userInformationsForm = this.formBuilder.group({
      username: new FormControl(this.userToModify?.username, Validators.required),
      password: new FormControl(this.userToModify?.password, Validators.required),
      mail: new FormControl(this.userToModify?.mail, Validators.required),
      currency: new FormControl(this.userToModify?.salaryHistory?.salaryCurrency, Validators.required),
      yearsOfExperience: new FormControl(this.userToModify?.salaryHistory?.totalYearsOfExperience, Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
      education: new FormControl(this.userToModify?.education),
      age: new FormControl(this.userToModify?.age, Validators.pattern('^[0-9]*$')),
      gender: new FormControl(this.userToModify?.gender),
      comment: new FormControl(this.userToModify?.comment),
    });
  }

  private initSalaryInfosForm() {
    this.salaryInfosForm = this.formBuilder.group({
      salaryInfos: this.formBuilder.array([])
    });
  }

  openDeleteUserDialog($event: MouseEvent) {
    let dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
    dialogRef.componentInstance.onDeleteUser.subscribe(() => {
      this.deleteUser()
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
}
