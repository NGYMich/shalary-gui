import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/UserService";
import {ForexService} from "../../services/ForexService";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/TokenStorageService";
import {Country} from "../../model/country";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import {getDefaultCellStyle, IS_BLUR_ACTIVATED_FOR_NOT_LOGGED_USER, totalSalaryCellStyle, totalYearsOfExperienceCellStyle} from "../global/cell-style";
import {User} from "../../model/user";
import {SalaryService} from "../../services/SalaryService";
import {RedirectService} from "../../services/RedirectService";
import {LocationCellRenderer} from "../careers/cell-renderers/location-cell-renderer";
import {SalaryCellRenderer} from "../careers/cell-renderers/salary-cell-renderer";
import {LocationService} from "../../services/LocationService";
import {commonContractTypes, commonEducationLevels, commonSectors} from "../global/common-variables";

@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.css']
})
export class SalariesComponent implements OnInit {
  mostPopularCountries: Country[] = [];
  @Input() rowData: any;
  isFilteredByPopularCountry: boolean = false;

  currencies = ['DEFAULT', 'EUR', 'USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD'];
  selectedCurrency = "DEFAULT";
  gridApi;
  gridColumnApi;
  forexRates: any;
  tooltipShowDelay = 0;
  tooltipHideDelay = 5000;
  isLoggedIn: boolean = false;

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
    }
  };
  allCountriesWithTheirFlags: Country[];

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
          field: 'location', sortable: true, resizable: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), cellRenderer: LocationCellRenderer, autoHeight: true,
        },
        {field: 'jobName', width: 300, headerName: 'Job', autoHeight: true, sortable: true, resizable: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {
          field: 'salaryHistory.totalYearsOfExperience', headerName: 'Experience', sortable: true, resizable: true, valueFormatter: this.experienceFormatter, filter: 'agTextColumnFilter', width: 150, autoHeight: true,
          cellStyle: params => totalYearsOfExperienceCellStyle(params.data.yearsOfExperience, this.isLoggedIn)
        },
        {field: 'companyName', width: 250, headerName: 'Company', sortable: true, resizable: true, autoHeight: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {field: 'companySector', width: 250, headerName: 'Sector', sortable: true, resizable: true, autoHeight: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {field: 'username', sortable: true, width: 150, resizable: true, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open'},
        {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},


        {field: 'salaryHistory.salaryCurrency', hide: true, autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {field: 'salaryHistory', hide: true, autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {
          valueGetter: this.totalSalaryValueGetter.bind(this),
          width: 150,
          editable: true,
          headerName: 'Total salary',
          sortable: true, resizable: true,
          filter: 'agNumberColumnFilter',
          autoHeight: true,
          cellRenderer: SalaryCellRenderer,
          cellRendererParams: {selectedCurrency: this.selectedCurrency},
          cellStyle: params => totalSalaryCellStyle(params, this.isLoggedIn),
        },
        {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', autoHeight: true, cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', autoHeight: true, cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', autoHeight: true, cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
      ]
    },

  ];
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


  applyNewCurrencySelected(currency: string) {
    this.selectedCurrency = this.selectedCurrency != currency ? this.selectedCurrency = currency : "DEFAULT";
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency, isSalaryComponent: true}
    this.gridApi.refreshCells(this.gridApi.columns);
    console.log(this.selectedCountries)
  }

  private loadCountriesWithFlag() {
    this.locationService.getCountriesWithFlags().subscribe((data: Country[]) => {
      this.allCountriesWithTheirFlags = data
    })
  }

  searchWithCriteria() {
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
