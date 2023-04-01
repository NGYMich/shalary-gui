import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
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
        animate(1000)
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
        animate('1s')
      ])
    ])
  ]
})
export class TestComponent implements OnInit {

  introductionMessage =
    `
        People do not know what their salary expectations should be. Some underestimate their market value, and some overestimate it : it can be very difficult to get accurate
        data. Well good news, Shalary is here to save you !
    `

  introductionMessage2 =
    `
        You need access to salaries. It's a taboo around you. No one talks about their current or past salaries. Well, here, everyone can view eachother's careers and everything is anonymous. What else to ask ?
    `

  introductionMessage3 =
    `
        You will be able to obtain interesting data thanks to the various testimonies of the users of the site.
        For
        example, you want to know the average salary of a data scientist after a master and 5 years of experience
        in
        Paris in consulting firms?
        No problem, Shalary is here for you.
    `

  introductionMessage4 =
    `
        There also will be articles about different topics : negociations, formations, learning, data analytics, economics, and much more. Beware !
    `
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

  navigateToSalaries() {
    this.router.navigate(['/salaries/view1'], {state: {chosenCountry: this.countriesControl.value}})
  }

  navigateToDataAnalytics() {
    this.router.navigate(['/data'])
  }
}


