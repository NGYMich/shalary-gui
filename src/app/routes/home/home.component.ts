import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {Country} from "../../model/country";
import {UserService} from "../../services/UserService";
import {LocationService} from "../../services/LocationService";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document


  isOpen = true;
  countriesControl = new FormControl("", (Validators.required))
  @Input() filteredCountries: Observable<Country[]>;
  allCountriesWithTheirFlags: any;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  constructor(private userService: UserService, private router: Router, private locationService: LocationService) {
    setTimeout(() => {
      this.toggle()
    }, 0);
  }

  ngOnInit(): void {
    this.loadCountriesWithFlag()
    this.countriesControl = new FormControl('')
    document.documentElement.style.setProperty('--vh', `${this.vh}px`);
  }

  private loadCountriesWithFlag() {
    this.countriesControl = new FormControl('France', (Validators.required))
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

  navigateToSalaries(isMobile: boolean = false) {
    if (!isMobile) {
      this.router.navigate(['/salaries/view1'], {state: {chosenCountry: this.countriesControl.value}})
    } else {
      this.router.navigate(['/salaries/view2'], {state: {chosenCountry: this.countriesControl.value}})
    }
  }

  navigateToDataAnalytics(isMobile: boolean = false) {
    this.router.navigate(['/data'])
  }

}
