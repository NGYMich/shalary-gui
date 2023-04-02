import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/UserService";
import {User} from "../../model/user";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import {MatDialog} from "@angular/material/dialog";
import {UserInfosDialogComponent} from "../../user-infos/user-infos-dialog/user-infos-dialog.component";
import {SalaryCellRenderer} from "./salary-cell-renderer";
import {LocationCellRenderer} from "./location-cell-renderer";
import {Country} from "../../model/country";
import {ForexService} from "../../services/ForexService";
import {CompanyCellRenderer} from "./company-cell-renderer";
import {JobCellRenderer} from "./job-cell-renderer";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/TokenStorageService";
import {totalSalaryCellStyle, totalYearsOfExperienceCellStyle} from "../global/common-variables";

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

  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 40,
    domLayout: 'autoHeight',
    suppressMenuHide: true
  };

  defaultColDef: ColDef = {
    tooltipValueGetter: (params) => {
      return params.value;
    }
  };

  constructor(private userService: UserService, private forexService: ForexService, public dialog: MatDialog, private router: Router,
              private tokenStorageService: TokenStorageService) {
  }

  totalSalaryValueGetter(params) {
    if (params.salaryHistory !== null) {
      let totalSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].totalSalary) : null;
      return this.applyRateToSalary(params, totalSalary);
    } else {
      return ''
    }
  };

  baseSalaryValueGetter(params) {
    if (params.salaryHistory != null) {
      let baseSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].baseSalary) : null;
      return this.applyRateToSalary(params, baseSalary)
    } else return ''
  };

  bonusSalaryValueGetter(params) {
    if (params.salaryHistory !== null) {
      let bonusSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].bonusSalary) : null;
      return this.applyRateToSalary(params, bonusSalary)
    } else return ''
  };

  stockSalaryValueGetter(params) {
    if (params.salaryHistory !== null) {
      let stockSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].stockSalary) : null;
      return this.applyRateToSalary(params, stockSalary)
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

    if (salaryInfos != null && salaryInfos.length > 0) {
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
        {field: 'id', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open'},
        {field: 'username', sortable: true, resizable: true, filter: 'agTextColumnFilter',},
        {valueGetter: this.currentJobGetter, headerName: 'Current job', sortable: true, resizable: true, filter: 'agTextColumnFilter'},
        {valueGetter: this.currentCompanyGetter, headerName: 'Current company', sortable: true, resizable: true, filter: 'agTextColumnFilter', cellRenderer: CompanyCellRenderer},
        {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open'},
        {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {field: 'modifiedDate', sortable: true, resizable: true, width: 140, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {
          field: 'salaryHistory.totalYearsOfExperience',
          headerName: 'Experience',
          sortable: true,
          resizable: true,
          valueFormatter: this.experienceFormatter,
          filter: 'agTextColumnFilter',
          width: 150,
          cellStyle: params => totalYearsOfExperienceCellStyle(params)

        },
        {
          field: 'location', sortable: true, resizable: true, filter: 'agTextColumnFilter',
          cellRenderer: LocationCellRenderer,
        },

      ]
    },
    {
      headerName: 'Salary',

      children: [
        {field: 'salaryHistory.salaryCurrency', hide: true},
        {field: 'salaryHistory.salaryInfos', hide: true},
        {field: 'salaryHistory', hide: true},
        {
          valueGetter: this.totalSalaryValueGetter.bind(this),
          width: 150,
          editable: true,
          headerName: 'Total salary',
          sortable: true, resizable: true,
          filter: 'agNumberColumnFilter',
          cellRenderer: SalaryCellRenderer,
          cellRendererParams: {selectedCurrency: this.selectedCurrency},
          cellStyle: params => totalSalaryCellStyle(params),
        },
        {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'closed', cellRenderer: SalaryCellRenderer},
        {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'closed', cellRenderer: SalaryCellRenderer},
        {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'closed', cellRenderer: SalaryCellRenderer},
        {valueGetter: this.increaseValueGetter.bind(this), width: 250, headerName: 'Increase since beginning', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'closed'},
      ]
    },
  ];
  mobileColumnDefs: (ColDef | ColGroupDef)[] | null | undefined = [
    {field: 'id', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', hide: true},
    {field: 'username', sortable: true, resizable: true, filter: 'agTextColumnFilter', hide: true},
    {
      valueGetter: this.currentJobGetter, headerName: 'Job (click cell for more)', sortable: true, resizable: true, filter: 'agTextColumnFilter',
      cellRenderer: JobCellRenderer,
      cellStyle: {"white-space": "normal"},
      autoHeight: true,
      width: 245
    },
    {valueGetter: this.currentCompanyGetter, headerName: 'Current company', sortable: true, resizable: true, filter: 'agTextColumnFilter', cellRenderer: CompanyCellRenderer, hide: true},
    {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open', hide: true},
    {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true},
    {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true},
    {field: 'modifiedDate', sortable: true, resizable: true, width: 140, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true},

    {field: 'salaryHistory.totalYearsOfExperience', headerName: 'Experience', sortable: true, resizable: true, valueFormatter: this.experienceFormatter, filter: 'agTextColumnFilter', width: 150, hide: true},
    {
      field: 'location', sortable: true, resizable: true, filter: 'agTextColumnFilter',
      cellRenderer: LocationCellRenderer, hide: true
    },

    {field: 'salaryHistory.salaryCurrency', hide: true},
    {field: 'salaryHistory.salaryInfos', hide: true},
    {field: 'salaryHistory', hide: true},
    {
      valueGetter: this.totalSalaryValueGetter.bind(this),
      width: 100,
      editable: true,
      headerName: 'Salary',
      sortable: true, resizable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: SalaryCellRenderer,
      cellRendererParams: {selectedCurrency: this.selectedCurrency},
      cellStyle: params => {
        let salary = params.value;
        switch (true) {
          case (salary < 20000):
            return
          case (salary < 30000):
            return {'background-color': '#cde2c4'}
          case (salary < 40000):
            return {'background-color': '#c4e0b8'}
          case (salary < 50000):
            return {'background-color': '#a8e28e'}
          case (salary < 60000):
            return {'background-color': '#9de080'}
          case (salary < 70000):
            return {'background-color': '#8ad569'}
          case (salary >= 70000):
            return {'background-color': '#79cd54'}
        }
        return
      }
    },
    {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRenderer: SalaryCellRenderer},
    {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRenderer: SalaryCellRenderer},
    {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRenderer: SalaryCellRenderer},
    {valueGetter: this.increaseValueGetter.bind(this), width: 250, headerName: 'Increase since beginning', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open'},

  ];


  experienceFormatter(params) {
    return params.value + ' years'
  }

  ngOnInit(): void {
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

  autoSizeAll() {
    const allColumnsIds: string[] = [];
    this.gridOptions.columnApi?.getAllColumns()?.forEach((column) => {
      allColumnsIds.push(column.getId());
    })
    this.gridOptions.columnApi?.autoSizeColumns(allColumnsIds, false)
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  openUserInfos(event): void {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedUser = selectedNodes.map(node => node.data)[0];
    this.dialog.open(UserInfosDialogComponent, {
      width: '100%',
      height: '80%',
      data: {selectedUser: selectedUser},
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel', 'custom-dialog-container']
    });
  }

  redirectToAddUserExperienceRoute(event): void {
    this.router.navigate(['/add-user-infos'])
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api!.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }

  filterByCountry(name: string) {
    if (this.isFilteredByPopularCountry && this.gridApi.getFilterInstance('location').appliedModel.filter == name) {
      this.gridApi.destroyFilter('location');
      this.isFilteredByPopularCountry = false;
    } else {
      this.gridApi.getFilterInstance('location').setModel({type: "equals", filter: name});
      this.isFilteredByPopularCountry = true;
    }
    this.gridApi!.onFilterChanged();
  }

  applyNewCurrencySelected(currency: string) {
    this.selectedCurrency = this.selectedCurrency != currency ? this.selectedCurrency = currency : "DEFAULT";
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency}
    this.gridApi.refreshCells(this.gridApi.columns);
  }

  private applyRateToSalary(params, totalSalary: number | null) {
    if (params.data.salaryHistory && params.data.salaryHistory.salaryCurrency != null && params.data.salaryHistory.salaryCurrency.substring(0, 3) && params.data.salaryHistory.salaryCurrency.substring(0, 3) != this.selectedCurrency && this.selectedCurrency != 'DEFAULT') {
      let pair = params.data.salaryHistory.salaryCurrency.substring(0, 3) + "_" + this.selectedCurrency
      // console.log(this.forexRates[pair])
      let rate = (pair in this.forexRates) ? this.forexRates[pair] : 1
      return totalSalary != null ? (Math.ceil(totalSalary * rate / 100) * 100).toFixed(0) : totalSalary;
    } else {
      return totalSalary
    }
  }
}
