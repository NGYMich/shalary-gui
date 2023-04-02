import {Component, Input, OnInit} from '@angular/core';
import {commonContractTypes, commonCurrencies, commonEducationLevels, commonGenders, commonSectors} from "../../global/common-variables";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../model/user";
import {map, Observable, startWith} from "rxjs";
import {Country} from "../../../model/country";
import {LocationService} from "../../../services/LocationService";
import {TokenStorageService} from "../../../services/TokenStorageService";

@Component({
  selector: 'user-informations-form',
  templateUrl: './user-informations-form-component.html',
  styleUrls: ['./user-informations-form.component.css']
})
export class UserInformationsFormComponent {

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
  showPassword: boolean = false;


  ngOnChanges() {
    this.initUserInformationsForm();
  }

  constructor(private formBuilder: FormBuilder, private locationService: LocationService, private tokenStorageService: TokenStorageService,
  ) {
  }

  initUserInformationsForm() {
    this.loadCountriesWithFlag()
    this.userInformationsForm = this.formBuilder.group({
      username: new FormControl(this.userToModify?.username, [Validators.required, Validators.minLength(3)]),
      password: new FormControl(this.userToModify?.password),
      email: new FormControl(this.userToModify?.email, [Validators.required, Validators.email]),
      currency: new FormControl(this.userToModify?.salaryHistory?.salaryCurrency,
        Validators.required
      ),
      yearsOfExperience: new FormControl(this.userToModify?.salaryHistory?.totalYearsOfExperience,
        Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])
      ),
      education: new FormControl(this.userToModify?.education),
      age: new FormControl(this.userToModify?.age, Validators.pattern('^[0-9]*$')),
      gender: new FormControl(this.userToModify?.gender),
      comment: new FormControl(this.userToModify?.comment),
      city: new FormControl(this.userToModify?.city),
    });
    this.countriesControl = new FormControl(this.userToModify?.location, Validators.required)
  }


  private loadCountriesWithFlag() {
    let country = this.userToModify?.location;
    this.countriesControl = new FormControl(country, (Validators.required))
    this.locationService.getCountriesWithFlags().subscribe((data: Country[]) => {
      this.allCountriesWithTheirFlags = data
      this.filteredCountries = this.countriesControl.valueChanges
        .pipe(
          startWith(''),
          map(country => country ? this._filterCountries(country) : this.allCountriesWithTheirFlags.slice()),
        );
    })
  }


  private _filterCountries(value): Country[] {
    const filterValue = value.toLowerCase();
    return this.allCountriesWithTheirFlags.filter(country => country.name.toLowerCase().indexOf(filterValue) === 0);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
