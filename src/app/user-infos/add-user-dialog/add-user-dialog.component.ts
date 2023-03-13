import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/UserService";
import {LocationService} from "../../services/LocationService";
import {Country} from "../../model/country";
import {map, Observable, startWith} from "rxjs";
import {User} from "../../model/user";

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  // user infos
  userInformationsForm: FormGroup;

  //salary infos & history
  salaryInfosForm: FormGroup;
  salaryHistoryForm: FormGroup;
  // countries
  countriesControl = new FormControl('Vietnam', (Validators.required));
  filteredCountries: Observable<Country[]>;
  // jobLevels = ['Intern', 'Apprentice', 'Junior', 'Intermediate', 'Senior'];
  currencies = ['EUR (€)', 'USD ($)', 'GBP (£)', 'JPY (¥)', 'CHF (₣)', 'AUD (AU$)', 'CAD (C$)'];
  educationLevels = ['Bootcamp', 'High School Graduate', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate Degree', 'Other']
  selectedGender;
  selectedCurrency;
  isUserAdded: boolean;
  userInformationError: boolean = false;
  salaryInformationsError: boolean = false;
  allCountriesWithTheirFlags: any
  usernameAlreadyExist: boolean;

  countriesOptions: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private locationService: LocationService
  ) {
  }

  // getters & setters
  get salaryInfos(): FormArray {
    return this.salaryInfosForm.get('salaryInfos') as FormArray;
  }

  ngOnInit(): void {
    this.initSalaryInfosForm();
    this.initUserInformationsForm();
    this.initWorkHistory();
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
    })
  }

  addUser($event: MouseEvent) {
    this.userService.getUsers().subscribe((users: User[]) => {
      let usernames: User[] = users.filter(user =>
        user.username == this.userInformationsForm.get('username')!.value
      );

      if (usernames.length != 0) {
        this.usernameAlreadyExist = true
        console.log("Username [" + this.userInformationsForm.get('username')!.value + "] is already taken")
      } else {
        this.usernameAlreadyExist = false
        if (this.userInformationsForm.valid) {
          if (this.salaryInfos.valid) {
            this.userService.addUser({
              id: null,
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
                salaryCurrency: this.userInformationsForm.get('currency')!.value,
                totalYearsOfExperience: this.userInformationsForm.get('yearsOfExperience')!.value,
                salaryInfos: this.salaryInfos.value
              }
            });
            this.isUserAdded = true;
            this.salaryInformationsError = false;
            this.userInformationError = false;
            location.reload()
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
    })


  }

  addNewJobFormLine(copyPastLine: boolean = false) {

    let controlsConfig;

    if (copyPastLine) {
      let lastSalaryInfo = this.salaryInfos.controls[this.salaryInfos.controls.length - 1]
      console.log(lastSalaryInfo)
      controlsConfig = {
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
    } else {
      controlsConfig = {
        yearsOfExperience: new FormControl('8', Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
        jobName: new FormControl('Tester', Validators.required),
        baseSalary: new FormControl('20000.5', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
        stockSalary: new FormControl(''),
        bonusSalary: new FormControl(''),
        totalSalary: new FormControl(''),
        company: this.formBuilder.group({
          name: 'DataDog',
          sector: 'IT'
        }),
      }
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


  // form initializers

  private initWorkHistory() {
    this.addNewJobFormLine();
    this.addNewJobFormLine();
  }

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.allCountriesWithTheirFlags.filter(country => country.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private initUserInformationsForm() {
    this.userInformationsForm = this.formBuilder.group({
      username: new FormControl('Example Username', Validators.required),
      password: new FormControl('test', Validators.required),
      mail: new FormControl('test@gmail.com', Validators.required),
      currency: new FormControl('EUR (€)', Validators.required),
      yearsOfExperience: new FormControl('8.0', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
      education: new FormControl(''),
      age: new FormControl('', Validators.pattern('^[0-9]*$')),
      gender: new FormControl(''),
      comment: new FormControl(''),
    });
  }

  private initSalaryInfosForm() {
    this.salaryInfosForm = this.formBuilder.group({
      salaryInfos: this.formBuilder.array([])
    });
  }
}
