import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../services/UserService";
import {User} from "../model/user";
import {GridOptions} from "ag-grid-community";
import {MatDialog} from "@angular/material/dialog";
import {UserInfosDialogComponent} from "../user-infos/user-infos-dialog/user-infos-dialog.component";
import {AddUserDialogComponent} from "../user-infos/add-user-dialog/add-user-dialog.component";
import {SalaryCellRenderer} from "./salary-cell-renderer";
import {LocationCellRenderer} from "./location-cell-renderer";
import {Country} from "../model/country";
import {ForexService} from "../services/ForexService";

@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.css']
})
export class SalariesComponent implements OnInit {

  users: User[] = [];
  mostPopularCountries: Country[] = [];
  @Input() rowData: any;
  @Input() isMobile: boolean;
  isFilteredByPopularCountry: boolean = false;
  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 40,
    domLayout: 'autoHeight',
  };
  currencies = ['DEFAULT', 'EUR', 'USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD'];
  selectedCurrency = "DEFAULT";
  private gridApi;
  private gridColumnApi;
  private forexRates: any;

  constructor(private userService: UserService, private forexService: ForexService, public dialog: MatDialog) {
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
    if (salaryInfos != null) {
      let latestCompany = salaryInfos[salaryInfos.length - 1].company;
      if (salaryInfos.length > 0 && latestCompany != null) {
        if (latestCompany.sector != null && latestCompany.sector != "") {
          return latestCompany.name + " (" + latestCompany.sector + ")";
        } else {
          return latestCompany.name
        }
      } else {
        return null
      }
    }

  }

  desktopColumnDefs = [
    {
      headerName: 'User Information',
      children: [
        // {field: 'id',sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter'},
        {field: 'username', sortable: true, resizable: true},
        {valueGetter: this.currentJobGetter, headerName: 'Current job', sortable: true, resizable: true, filter: 'agTextColumnFilter'},
        {valueGetter: this.currentCompanyGetter, headerName: 'Current company', sortable: true, resizable: true, filter: 'agTextColumnFilter'},
        {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open'},
        {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {
          field: 'location', sortable: true, resizable: true, filter: 'agTextColumnFilter',
          cellRendererFramework: LocationCellRenderer,
        },
        {field: 'salaryHistory.totalYearsOfExperience', headerName: 'Work experience', sortable: true, resizable: true, valueFormatter: this.experienceFormatter, filter: 'agTextColumnFilter'},
      ]
    },
    {
      headerName: 'Salary Informations',
      children: [
        {field: 'salaryHistory.salaryCurrency', hide: true},
        {field: 'salaryHistory.salaryInfos', hide: true},
        {field: 'salaryHistory', hide: true},
        {
          value: 'totalSalary',
          valueGetter: this.totalSalaryValueGetter.bind(this),
          width: 150,
          editable: true,
          headerName: 'Total salary',
          sortable: true, resizable: true,
          filter: 'agNumberColumnFilter',
          cellRendererFramework: SalaryCellRenderer,
          cellRendererParams: {
            selectedCurrency: this.selectedCurrency
          },
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
        {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.increaseValueGetter.bind(this), width: 250, headerName: 'Increase since beginning', sortable: true, resizable: true, filter: 'agTextColumnFilter',},
      ]
    },
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
    this.userService.getUsers().subscribe((users: User[]) => {
      this.rowData = users;
    })
  }

  loadForexes() {
    this.forexService.getTopForexRates().subscribe((forexes: any) => {
      if (forexes != null) {
        this.forexRates = forexes;
      }
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
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }

  openSalaryAddingDialog(event): void {
    this.dialog.open(AddUserDialogComponent, {
      width: '100%',
      height: '90%',
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
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
    if (params.data.salaryHistory.salaryCurrency.substring(0, 3) != this.selectedCurrency && this.selectedCurrency != 'DEFAULT') {
      let pair = params.data.salaryHistory.salaryCurrency.substring(0, 3) + "_" + this.selectedCurrency
      let rate = this.forexRates[pair] != null ? this.forexRates[pair] : 1
      return totalSalary != null ? (Math.ceil(totalSalary * rate / 100) * 100).toFixed(0) : totalSalary;
    } else {
      return totalSalary
    }
  }
}
