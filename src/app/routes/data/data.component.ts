import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../services/UserService";
import {LocationService} from "../../services/LocationService";
import {Country} from "../../model/country";
import {commonContractTypes, commonEducationLevels, commonSectors} from "../global/common-variables";
import {FormControl} from "@angular/forms";
import {ForexService} from "../../services/ForexService";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/TokenStorageService";
import {SalaryService} from "../../services/SalaryService";
import {RedirectService} from "../../services/RedirectService";
import {NumberService} from "../../services/NumberService";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  users: User[]
  countries: any;
  userCountries: (string | null)[];

  currencies = ['DEFAULT', 'EUR', 'USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD'];
  selectedCurrency = "DEFAULT";
  gridApi;
  gridColumnApi;
  forexRates: any;
  tooltipShowDelay = 0;
  tooltipHideDelay = 5000;
  isLoggedIn: boolean = false;
  selectedCountries: any;
  selectedSalaryRanges: any;
  selectedSectors: any;
  selectedEducations: any;
  selectedContracts: any;
  selectedCompanies: any;
  selectedJobs: any;
  allCountriesWithTheirFlags: Country[];
  allCountriesName: any;
  educations: any = commonEducationLevels;
  contracts: any = commonContractTypes;
  sectors: any = commonSectors.slice(1);
  salaryRanges: any = [' <30 000€', '>= 30 000€, < 60 000€', '>= 60 000€, < 100 000€', '>= 100 000€']
  companies: any;
  jobNames: any;

  countriesControl = new FormControl();
  salaryRangesControl = new FormControl();
  sectorsControl = new FormControl();
  educationsControl = new FormControl();
  contractsControl = new FormControl();
  companiesControl = new FormControl();
  jobsControl = new FormControl();
  salaries: any;
  sumSalaries: any;
  avgSalary: any;
  uniqueSectors: any;
  uniqueContracts: any;
  uniqueJobs: any;
  uniqueCompanies: any;
  minSalary: any;
  maxSalary: any;


  constructor(private userService: UserService, private forexService: ForexService, public dialog: MatDialog, private router: Router,
              private tokenStorageService: TokenStorageService, public salaryService: SalaryService, public redirectService: RedirectService, private locationService: LocationService, private numberService: NumberService) {
    // this.loadLocations();
  }


  ngOnInit(): void {
    this.loadJobs()
    this.loadCompanies()
    this.loadCountriesWithFlag()
    this.salaries = this.salaryService.getSalaries().subscribe((salaries) => {
      this.salaries = salaries
      this.computeData();
    })
  }

  private loadLocations() {
    this.locationService.getCountriesWithFlags().subscribe((data: Country[]) => {
      let flagsToIgnore = ["Afghanistan"];
      console.log("countries :", data);
      this.userService.getUsers().subscribe((users: User[]) => {
        this.users = users;
        this.userCountries = this.users.map(user => user.location)
        this.countries = data.filter(flag => flag.flag != null && !flagsToIgnore.includes(flag.name) && this.userCountries.includes(flag.name))
        console.log("userCountries :", this.userCountries);

      })

    })
  }


  searchWithCriteria() {
    if (this.selectedCountries != null || this.selectedJobs != null || this.selectedSectors != null || this.selectedCompanies != null || this.selectedSalaryRanges != null || this.selectedEducations != null || this.selectedContracts != null) {
      this.salaryService.getSalariesWithSearchCriteria({
          locations: this.selectedCountries,
          jobs: this.selectedJobs,
          sectors: this.selectedSectors,
          companies: this.selectedCompanies,
          salaryRanges: this.selectedSalaryRanges,
          educationLevels: this.selectedEducations,
          contractTypes: this.selectedContracts,
        }
      ).subscribe((salaries) => {
        this.salaries = salaries;
        this.computeData();
      })
    }
  }


  resetFilters() {
    this.selectedCountries = null
    this.selectedJobs = null
    this.selectedSectors = null
    this.selectedCompanies = null
    this.selectedSalaryRanges = null
    this.selectedEducations = null
    this.selectedContracts = null
  }

  computeData() {
    if (this.salaries.length > 0) {
      let totalSalaries = this.salaries?.map(it => it.totalSalary);
      let sum = totalSalaries?.reduce((a, b) => a + b, 0);
      console.log('Computing sum of salaries')
      this.sumSalaries = this.numberService.formatBigNumberWithSpaces(sum, "€");
      console.log('Computing average salaries')
      this.avgSalary = this.numberService.formatBigNumberWithSpaces((+(sum / this.salaries?.length).toFixed(0)), "€")


      this.uniqueSectors = new Set(this.salaries.map(salary => salary.sector)).size
      this.uniqueContracts = new Set(this.salaries.map(salary => salary.contractType)).size
      this.uniqueJobs = new Set(this.salaries.map(salary => salary.jobName)).size
      this.uniqueCompanies = new Set(this.salaries.map(salary => salary.companyName)).size
      this.minSalary = this.numberService.formatBigNumberWithSpaces(Math.min(...totalSalaries), "€")
      this.maxSalary = this.numberService.formatBigNumberWithSpaces(Math.max(...totalSalaries), "€")
    } else {
      this.resetAllData()
    }

  }

  private resetAllData() {
    this.sumSalaries = 0
    this.avgSalary = 0

    this.uniqueSectors = 0
    this.uniqueContracts = 0
    this.uniqueJobs = 0
    this.uniqueCompanies = 0
    this.minSalary = 0
    this.maxSalary = 0

  }


  loadSalaries() {
    this.salaryService.getSalaries().subscribe((salaries: User[]) => {
      this.salaries = salaries;
    })
  }

  loadJobs() {
    this.salaryService.getJobs().subscribe((jobs: User[]) => {
      this.jobNames = jobs;
    })
  }

  loadCompanies() {
    this.salaryService.getCompanies().subscribe((companies: User[]) => {
      this.companies = companies;
    })
  }

  private loadCountriesWithFlag() {
    this.locationService.getCountriesWithFlags().subscribe((data: Country[]) => {
      this.allCountriesWithTheirFlags = data
      this.allCountriesName = this.allCountriesWithTheirFlags.map(country => country.name)
    })
  }
}
