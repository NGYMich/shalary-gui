import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/UserService";
import {animate, state, style, transition, trigger,} from '@angular/animations';
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {Country} from "../../model/country";
import {LocationService} from "../../services/LocationService";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  animations: [
    trigger('openClose', [
      state('in', style({transform: 'translateX(0)'})),
      transition('open => closed', [
        style({transform: 'translateX(-100%)'}),
        animate(1000)
      ]),
      transition('closed => open', [
        animate(1000, style({transform: 'translateX(100%)'}))
      ])
    ]),

    trigger('openClose2', [
      state('in', style({transform: 'translateY(0)'})),
      transition('open => closed', [
        style({transform: 'translateY(-100%)'}),
        animate('1000ms 0ms')
      ]),
      transition('closed => open', [
        animate(1000, style({transform: 'translateY(100%)'}))
      ])
    ]),

    trigger('apparition', [
      state('open', style({
        opacity: '0'
      })),
      state('closed', style({
        opacity: '1'
      })),
      transition('open => closed', [
        animate('1000ms 1000ms')
      ])
    ])
  ]
})
export class TestComponent implements OnInit {
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


