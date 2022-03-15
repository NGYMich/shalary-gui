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
  private gridApi;
  private gridColumnApi;

  constructor(private userService: UserService, public dialog: MatDialog) {
  }

  totalSalaryValueGetter = function (params) {
    return params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].totalSalary) : null;
  };

  baseSalaryValueGetter = function (params) {
    return params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].baseSalary) : null;
  };

  bonusSalaryValueGetter = function (params) {
    return params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].bonusSalary) : null;
  };

  stockSalaryValueGetter = function (params) {
    return params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].stockSalary) : null;
  };

  increaseValueGetter = function (params) {
    let salaryInfos = params.getValue('salaryHistory.salaryInfos');
    if (salaryInfos.length > 0) {
      let latestSalary = salaryInfos[salaryInfos.length - 1].totalSalary
      let firstSalary = salaryInfos[0].totalSalary
      let increasePercent = Number(latestSalary / firstSalary * 100 - 1);
      return String((increasePercent >= 0 ? "+" : " - ") + increasePercent.toFixed(2)) + "%";
    } else {
      return null;
    }
  };

  currentJobGetter = function (params) {
    let salaryInfos = params.getValue('salaryHistory.salaryInfos');
    return salaryInfos.length > 0 ? salaryInfos[salaryInfos.length - 1].jobName : null
  }

  currentCompanyGetter = function (params) {
    let salaryInfos = params.getValue('salaryHistory.salaryInfos');
    let latestCompany = salaryInfos[salaryInfos.length - 1].company;
    if (salaryInfos.length > 0 && latestCompany != null) {
      if (latestCompany.sector != null) {
        return latestCompany.name + " (" + latestCompany.sector + ")";
      } else {
        return latestCompany.name
      }
    } else {
      return null
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
        {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'closed'},
        {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', columnGroupShow: 'closed'},
        {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter'},
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
          valueGetter: this.totalSalaryValueGetter,
          width: 150,
          headerName: 'Total salary',
          sortable: true, resizable: true,
          filter: 'agNumberColumnFilter',
          cellRendererFramework: SalaryCellRenderer,
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
        {valueGetter: this.baseSalaryValueGetter, width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.bonusSalaryValueGetter, width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.stockSalaryValueGetter, width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.increaseValueGetter, width: 250, headerName: 'Increase since beginning', sortable: true, resizable: true, filter: 'agTextColumnFilter',},
      ]
    },
  ];

  experienceFormatter(params) {
    return params.value + ' years'
  }

  ngOnInit(): void {
    this.loadMostPopularCountries();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.rowData = users;
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

  // autoColumnSizesWithButton(skipHeader): void {
  //   const allColumnIds = this.gridColumnApi.getAllColumns().map((column) => column.colId);
  //   this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  // }

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
}
