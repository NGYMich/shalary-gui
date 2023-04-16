import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../services/UserService";
import {User} from "../../../model/user";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import {MatDialog} from "@angular/material/dialog";
import {UserInfosDialogComponent} from "../../../user-infos/user-infos-dialog/user-infos-dialog.component";
import {SalaryCellRenderer} from "../cell-renderers/salary-cell-renderer";
import {LocationCellRenderer} from "../cell-renderers/location-cell-renderer";
import {Country} from "../../../model/country";
import {ForexService} from "../../../services/ForexService";
import {CompanyCellRenderer} from "../cell-renderers/company-cell-renderer";
import {JobCellRenderer} from "../cell-renderers/job-cell-renderer";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../../services/TokenStorageService";
import {getDefaultCellStyle, IS_BLUR_ACTIVATED_FOR_NOT_LOGGED_USER, totalSalaryCellStyle, totalYearsOfExperienceCellStyle} from "../../global/cell-style";
import {SalaryService} from "../../../services/SalaryService";
import {RedirectService} from "../../../services/RedirectService";

@Component({
  selector: 'app-salaries',
  templateUrl: './careers-data-view.component.html',
  styleUrls: ['./careers-data-view.component.css']
})
export class CareersDataViewComponent implements OnInit {

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
  selectedUserRowIndex: any;

  constructor(private userService: UserService, public salaryService: SalaryService, private forexService: ForexService, public dialog: MatDialog, private router: Router,
              private tokenStorageService: TokenStorageService, public redirectService: RedirectService) {
  }

  totalSalaryValueGetter(params) {
    if (params.salaryHistory !== null) {
      let totalSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].totalSalary) : null;
      return this.salaryService.applyRateToSalary(params, totalSalary, this.selectedCurrency, this.forexRates);
    } else {
      return ''
    }
  };

  baseSalaryValueGetter(params) {
    if (params.salaryHistory != null) {
      let baseSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].baseSalary) : null;
      return this.salaryService.applyRateToSalary(params, baseSalary, this.selectedCurrency, this.forexRates)
    } else return ''
  };

  bonusSalaryValueGetter(params) {
    if (params.salaryHistory !== null) {
      let bonusSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].bonusSalary) : null;
      return this.salaryService.applyRateToSalary(params, bonusSalary, this.selectedCurrency, this.forexRates)
    } else return ''
  };

  stockSalaryValueGetter(params) {
    if (params.salaryHistory !== null) {
      let stockSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].stockSalary) : null;
      return this.salaryService.applyRateToSalary(params, stockSalary, this.selectedCurrency, this.forexRates)
    } else return ''
  };

  increaseValueGetter = function (params) {
    if (params.salaryHistory !== null) {
      let salaryInfos = params.getValue('salaryHistory.salaryInfos');
      if (salaryInfos.length > 0) {
        let latestSalary = salaryInfos[salaryInfos.length - 1].totalSalary
        let firstSalary = salaryInfos[0].totalSalary
        let increasePercent = Number(latestSalary / firstSalary * 100 - 100);
        return String((increasePercent >= 0 ? "+" : "") + increasePercent.toFixed(2)) + "%";
      } else {
        return null;
      }
    } else {
      return null;
    }


  };

  currentJobGetter = function (params) {
    let salaryInfos = params.getValue('salaryHistory.salaryInfos');
    return salaryInfos?.length > 0 ? salaryInfos[salaryInfos.length - 1].jobName : null
  }

  currentCompanyGetter = function (params) {
    let salaryInfos = params.getValue('salaryHistory.salaryInfos');
    let company;

    if (salaryInfos?.length > 0) {
      let latestCompany = salaryInfos[salaryInfos.length - 1].company;
      if (salaryInfos.length > 0 && latestCompany != null) {
        if (latestCompany.sector != null && latestCompany.sector != "") {
          company = latestCompany.name + " (" + latestCompany.sector + ")";
        } else {
          company = latestCompany.name
        }
      } else {
        company = null
      }
    }

    return company;

  }

  desktopColumnDefs: (ColDef | ColGroupDef)[] | null | undefined = [
    {
      headerName: 'User',
      children: [
        {field: 'id', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', autoHeight: true, columnGroupShow: 'open', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {field: 'username', sortable: true, width: 150, resizable: true, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.currentJobGetter, width: 300, headerName: 'Current job', autoHeight: true, sortable: true, resizable: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.currentCompanyGetter, width: 250, headerName: 'Current company', sortable: true, resizable: true, autoHeight: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), cellRenderer: CompanyCellRenderer},
        {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {field: 'modifiedDate', sortable: true, resizable: true, width: 140, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,), columnGroupShow: 'open'},
        {
          field: 'salaryHistory.totalYearsOfExperience',
          headerName: 'Experience',
          sortable: true,
          resizable: true,
          valueFormatter: this.experienceFormatter,
          filter: 'agTextColumnFilter',
          width: 150, autoHeight: true,
          cellStyle: params => totalYearsOfExperienceCellStyle(params, this.isLoggedIn)

        },
        {
          field: 'location', sortable: true, resizable: true, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,),
          cellRenderer: LocationCellRenderer, autoHeight: true,
        },
      ]
    },
    {
      headerName: 'Salary',

      children: [
        {field: 'salaryHistory.salaryCurrency', hide: true, autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {field: 'salaryHistory.salaryInfos', hide: true, autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
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
        {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', autoHeight: true, columnGroupShow: 'closed', cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', autoHeight: true, columnGroupShow: 'closed', cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', autoHeight: true, columnGroupShow: 'closed', cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)},
        {valueGetter: this.increaseValueGetter.bind(this), width: 250, headerName: 'Increase since beginning', sortable: true, resizable: true, filter: 'agTextColumnFilter', autoHeight: true, columnGroupShow: 'closed', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,)}
      ]
    },
  ];
  mobileColumnDefs: (ColDef | ColGroupDef)[] | null | undefined = [
    {field: 'id', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {field: 'username', sortable: true, resizable: true, filter: 'agTextColumnFilter', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {
      valueGetter: this.currentJobGetter, headerName: 'Job (click user to see career)', sortable: true, resizable: true, filter: 'agTextColumnFilter',
      cellRenderer: JobCellRenderer,
      cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),
      autoHeight: true,
      width: 240
    },
    {valueGetter: this.currentCompanyGetter, headerName: 'Current company', sortable: true, resizable: true, filter: 'agTextColumnFilter', cellRenderer: CompanyCellRenderer, hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {field: 'modifiedDate', sortable: true, resizable: true, width: 140, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},

    {field: 'salaryHistory.totalYearsOfExperience', headerName: 'Experience', sortable: true, resizable: true, valueFormatter: this.experienceFormatter, filter: 'agTextColumnFilter', width: 150, hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {
      field: 'location', sortable: true, resizable: true, filter: 'agTextColumnFilter',
      cellRenderer: LocationCellRenderer, hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),
    },

    {field: 'salaryHistory.salaryCurrency', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {field: 'salaryHistory.salaryInfos', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {field: 'salaryHistory', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {
      valueGetter: this.totalSalaryValueGetter.bind(this),
      width: 130,
      editable: true,
      headerName: 'Salary',
      sortable: true, resizable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: SalaryCellRenderer,
      cellRendererParams: {selectedCurrency: this.selectedCurrency},
      cellStyle: params => totalSalaryCellStyle(params, this.isLoggedIn)
    },
    {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRenderer: SalaryCellRenderer, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},
    {valueGetter: this.increaseValueGetter.bind(this), width: 250, headerName: 'Increase since beginning', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),},

  ];


  experienceFormatter(params) {
    return params.value + ' years'
  }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.getUser() != null && this.tokenStorageService.getUser() != ""
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency}
    this.loadMostPopularCountries();
    this.loadUsers();
    this.loadForexes();
  }

  loadUsers() {
    this.userService.getUsersWithSalaryHistory().subscribe((users: User[]) => {
      this.rowData = users;
    })
  }

  loadForexes() {
    this.forexService.getTopForexRates().subscribe((forexes: any) => {
      this.forexRates = forexes;
      console.log("forexes : ", this.forexRates);
    })
  }

  loadMostPopularCountries() {
    this.userService.getMostPopularCountriesFromUsers().subscribe((mostPopularCountries: Country[]) => {
      this.mostPopularCountries = mostPopularCountries;
      console.log('most popular countries :', this.mostPopularCountries)
    });
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  openUserInfos(event): void {
    this.selectedUserRowIndex = this.gridApi.getSelectedNodes()[0].rowIndex;
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedUser = selectedNodes.map(node => node.data)[0];
    this.dialog.open(UserInfosDialogComponent, {
      width: '100%',
      height: '85%',
      data: {
        selectedUser: selectedUser,
        selectedRowIndex: this.selectedUserRowIndex
      },
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel', 'custom-dialog-container']
    });
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api!.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }

  applyNewCurrencySelected(currency: string) {
    this.selectedCurrency = this.selectedCurrency != currency ? this.selectedCurrency = currency : "DEFAULT";
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency}
    this.gridApi.refreshCells(this.gridApi.columns);
  }

}
