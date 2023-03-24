import {Component, Input, OnInit} from '@angular/core';
import {commonContractTypes, commonCurrencies, commonEducationLevels, commonGenders, commonSectors} from "../../common-variables";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../model/user";
import {map, Observable, startWith} from "rxjs";
import {Country} from "../../../../model/country";
import {LocationService} from "../../../../services/LocationService";

@Component({
  selector: 'app-user-informations-form-component',
  templateUrl: './user-informations-form-component.html',
  styleUrls: ['./user-informations-form.component.css']
})
export class UserInformationsFormComponent implements OnInit {

  @Input() userToModify: User | null = null;
  @Input() isEditUserPage: boolean;

  educationLevels = commonEducationLevels;
  genders = commonGenders
  currencies = commonCurrencies
  sectors = commonSectors
  // countries
  countriesControl = new FormControl("", (Validators.required))
  @Input() filteredCountries: Observable<Country[]>;
  selectedGender;
  selectedCurrency;
  selectedEducation;
  // user infos
  userInformationsForm: FormGroup;
  isUserAdded: boolean;
  isUserLoaded: boolean = false;
  showPasswordError: boolean;
  allCountriesWithTheirFlags: any;

  ngOnInit() {
    this.initUserInformationsForm();

  }

  ngOnChanges() {
    this.initUserInformationsForm();
  }

  constructor(private formBuilder: FormBuilder, private locationService: LocationService,
  ) {
  }

  initUserInformationsForm() {
    this.loadCountriesWithFlag()

    if (!this.isEditUserPage) {
      this.userInformationsForm = this.formBuilder.group({
        username: new FormControl('UsernameExample', Validators.required),
        password: new FormControl('test', Validators.required),
        mail: new FormControl('test@gmail.com', Validators.required),
        currency: new FormControl('EUR (€)', Validators.required),
        city: new FormControl(''),
        yearsOfExperience: new FormControl('8.0', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
        education: new FormControl(''),
        age: new FormControl('', Validators.pattern('^[0-9]*$')),
        gender: new FormControl(''),
        comment: new FormControl(''),
      });
    } else {
      console.log("init user informations. User :" + this.userToModify)
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
        city: new FormControl(this.userToModify?.city),
      });
      this.countriesControl = new FormControl(this.userToModify?.location, (Validators.required))
      console.log(this.userInformationsForm)
    }


  }


  private loadCountriesWithFlag() {
    this.countriesControl = new FormControl(this.userToModify?.location, (Validators.required))
    this.locationService.getCountriesWithFlags().subscribe((data: Country[]) => {
      this.allCountriesWithTheirFlags = data
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
  }


  private _filterCountries(value): Country[] {
    const filterValue = value.toLowerCase();
    return this.allCountriesWithTheirFlags.filter(country => country.name.toLowerCase().indexOf(filterValue) === 0);
  }

  get userInfos(): FormArray {
    return this.userInformationsForm.get('userInfos') as FormArray;
  }
}
