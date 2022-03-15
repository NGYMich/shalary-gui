import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/UserService";
import {LocationService} from "../../services/LocationService";
import {Country} from "../../model/country";
import {map, Observable, startWith} from "rxjs";

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
  countriesControl = new FormControl('', (Validators.required));
  filteredCountries: Observable<Country[]>;
  // jobLevels = ['Intern', 'Apprentice', 'Junior', 'Intermediate', 'Senior'];
  currencies = ['€', '$', '£', '¥', 'CHF'];
  educationLevels = ['Bootcamp', 'High School Graduate', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate Degree', 'Other']
  selectedGender;
  selectedCurrency;
  isUserAdded: boolean;
  userInformationError: boolean = false;
  salaryInformationsError: boolean = false;
  allCountriesWithTheirFlags: any;
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
    console.info("salary infos : ", this.salaryInfos)
    if (this.userInformationsForm.valid) {
      if (this.salaryInfos.valid) {
        this.userService.addUser({
          id: null,
          locationImage: null,
          validated: true,
          username: this.userInformationsForm.get('username')!.value,
          password: this.userInformationsForm.get('password')!.value,
          mail: this.userInformationsForm.get('mail')!.value,
          mainSector: this.userInformationsForm.get('mainSector')!.value,
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
      } else {
        this.isUserAdded = false;
        this.salaryInformationsError = true;
        this.userInformationError = false;
        console.log(this.salaryInfosForm)
      }
    } else {
      this.isUserAdded = false;
      this.salaryInformationsError = false;
      this.userInformationError = true;
      console.log(this.userInformationsForm)
    }

  }

  addNewJobFormLine() {
    this.salaryInfos.push(this.formBuilder.group({
          yearsOfExperience: new FormControl('', Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
          jobName: new FormControl('', Validators.required),
          baseSalary: new FormControl('', Validators.required),
          stockSalary: new FormControl(''),
          bonusSalary: new FormControl(''),
          totalSalary: new FormControl(''),
          company: this.formBuilder.group({
            name: '',
            sector: ''
          }),
        }
      )
    );
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

  private initWorkHistory() {
    this.addNewJobFormLine();
    this.addNewJobFormLine();
  }

  // form initializers

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.allCountriesWithTheirFlags.filter(country => country.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private initUserInformationsForm() {
    this.userInformationsForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      mail: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      yearsOfExperience: new FormControl('', Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
      mainSector: new FormControl(''),
      education: new FormControl(''),
      age: new FormControl('', Validators.pattern('^[0-9]*$')),
      gender: new FormControl(''),
      comment: new FormControl(''),
    });
  }

  private initSalaryHistoryForm() {
    this.salaryHistoryForm = this.formBuilder.group({
      salaryCurrency: '',
      totalYearsOfExperience: '',
      salaryInfos: this.salaryInfos.value

    })
  }

  private initSalaryInfosForm() {
    this.salaryInfosForm = this.formBuilder.group({
      salaryInfos: this.formBuilder.array([])
    });
  }
}
