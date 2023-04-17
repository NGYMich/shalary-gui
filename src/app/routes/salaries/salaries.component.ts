import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/UserService";
import {ForexService} from "../../services/ForexService";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/TokenStorageService";
import {Country} from "../../model/country";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import {filterParams, getDefaultCellStyle, IS_BLUR_ACTIVATED_FOR_NOT_LOGGED_USER, totalSalaryCellStyle, totalYearsOfExperienceCellStyle} from "../global/cell-style";
import {User} from "../../model/user";
import {SalaryService} from "../../services/SalaryService";
import {RedirectService} from "../../services/RedirectService";
import {LocationCellRenderer} from "../careers/cell-renderers/location-cell-renderer";
import {SalaryCellRenderer} from "../careers/cell-renderers/salary-cell-renderer";
import {LocationService} from "../../services/LocationService";
import {commonContractTypes, commonEducationLevels, commonSectors} from "../global/common-variables";
import {FormControl} from "@angular/forms";
import {UserInfosDialogComponent} from "../../user-infos/user-infos-dialog/user-infos-dialog.component";

@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.css']
})
export class SalariesComponent implements OnInit {
  @Input() rowData: any;

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

  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 50,
    domLayout: 'autoHeight',
    rowHeight: 40,
    suppressMenuHide: true
  };

  defaultColDef: ColDef = {
    tooltipValueGetter: (params) => {
      return this.isLoggedIn && !IS_BLUR_ACTIVATED_FOR_NOT_LOGGED_USER ? params.value : "";
    },
    filterParams: filterParams,
    sortable: true,
    resizable: true,
  };
  allCountriesWithTheirFlags: Country[];
  allCountriesName: any;
  selectedUserRowIndex: any;

  constructor(private userService: UserService, private forexService: ForexService, public dialog: MatDialog, private router: Router,
              private tokenStorageService: TokenStorageService, public salaryService: SalaryService, public redirectService: RedirectService, private locationService: LocationService) {
  }


  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.getUser() != null && this.tokenStorageService.getUser() != ""
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency, isSalaryComponent: true}
    this.loadSalaries();
    this.loadJobs()
    this.loadCompanies()
    this.loadForexes();
    this.loadCountriesWithFlag()

  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }


  loadSalaries() {
    this.salaryService.getSalaries().subscribe((salaries: User[]) => {
      this.rowData = salaries;
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

  loadForexes() {
    this.forexService.getTopForexRates().subscribe((forexes: any) => {
      this.forexRates = forexes;
      console.log("forexes : ", this.forexRates);
    })
  }


  totalSalaryValueGetter(params) {
    return this.salaryService.applyRateToSalary(params, Number(params.data.totalSalary), this.selectedCurrency, this.forexRates, params.data.currency)
  };

  baseSalaryValueGetter(params) {
    return this.salaryService.applyRateToSalary(params, Number(params.data.baseSalary), this.selectedCurrency, this.forexRates, params.data.currency)
  };

  bonusSalaryValueGetter(params) {
    return this.salaryService.applyRateToSalary(params, Number(params.data.bonusSalary), this.selectedCurrency, this.forexRates, params.data.currency)
  };


  stockSalaryValueGetter(params) {
    return this.salaryService.applyRateToSalary(params, Number(params.data.stockSalary), this.selectedCurrency, this.forexRates, params.data.currency)
  };

  currentJobGetter = function (params) {

  }

  currentCompanyGetter = function (params) {
  }

  experienceFormatter(params) {
    return params.data.yearsOfExperience + ' years'
  }

  desktopColumnDefs: (ColDef | ColGroupDef)[] | null | undefined = [
    {
      headerName: 'User',
      children: [
        {
          field: 'location', filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), cellRenderer: LocationCellRenderer, autoHeight: true,
        },
        {field: 'jobName', width: 300, headerName: 'Job', autoHeight: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {
          headerName: 'Experience', valueFormatter: this.experienceFormatter, filter: 'agTextColumnFilter', width: 150, autoHeight: true,
          cellStyle: params => totalYearsOfExperienceCellStyle(params, this.isLoggedIn)
        },
        {field: 'companyName', width: 250, headerName: 'Company', autoHeight: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {field: 'companySector', width: 250, headerName: 'Sector', autoHeight: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {field: 'username', width: 150, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open'},
        {field: 'age', width: 100, filter: 'agNumberColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {field: 'gender', width: 100, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {field: 'education', filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {field: 'contractType', headerName: 'Contract Type', filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},


        {field: 'salaryHistory.salaryCurrency', hide: true, autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {field: 'salaryHistory', hide: true, autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {
          valueGetter: this.totalSalaryValueGetter.bind(this),
          width: 150,
          editable: true,
          headerName: 'Total salary',

          filter: 'agNumberColumnFilter',
          autoHeight: true,
          cellRenderer: SalaryCellRenderer,
          cellRendererParams: {selectedCurrency: this.selectedCurrency},
          cellStyle: params => totalSalaryCellStyle(params, this.isLoggedIn),
        },
        {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', filter: 'agNumberColumnFilter', autoHeight: true, cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', filter: 'agNumberColumnFilter', autoHeight: true, cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', filter: 'agNumberColumnFilter', autoHeight: true, cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
      ]
    },

  ];
  selectedCountry: any;

  applyNewCurrencySelected(currency: string) {
    this.selectedCurrency = this.selectedCurrency != currency ? this.selectedCurrency = currency : "DEFAULT";
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency, isSalaryComponent: true}
    this.gridApi.refreshCells(this.gridApi.columns);
    console.log(this.selectedCountries)
  }

  private loadCountriesWithFlag() {
    this.locationService.getCountriesWithFlags().subscribe((data: Country[]) => {
      this.allCountriesWithTheirFlags = data
      this.allCountriesName = this.allCountriesWithTheirFlags.map(country => country.name)
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
      ).subscribe((salaries: User[]) => {
        this.rowData = salaries;
      })
    }
  }


  openUserInfos($event) {
    // console.log(this.gridApi.getSelectedNodes()[0].data.userId)
    this.userService.getUserById(this.gridApi.getSelectedNodes()[0].data.userId).subscribe(data => {
      this.selectedUserRowIndex = this.gridApi.getSelectedNodes()[0].rowIndex;
      this.dialog.open(UserInfosDialogComponent, {
        width: '100%',
        height: '85%',
        data: {
          selectedUser: data,
          selectedRowIndex: this.selectedUserRowIndex
        },
        autoFocus: false,
        panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel', 'custom-dialog-container']
      });
    })


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
}
