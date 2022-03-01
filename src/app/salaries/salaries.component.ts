import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../services/UserService";
import {User} from "../model/user";
import {GridOptions} from "ag-grid-community";
import {MatDialog} from "@angular/material/dialog";
import {DeviceDetectorService} from 'ngx-device-detector';
import {UserInfosDialogComponent} from "../user-infos/user-infos-dialog/user-infos-dialog.component";
import {AddUserDialogComponent} from "../user-infos/add-user-dialog/add-user-dialog.component";
import {SalaryCellRenderer} from "./salary-cell-renderer";

@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.css']
})
export class SalariesComponent implements OnInit {

  users: User[] = [];
  @Input() rowData: any;
  @Input() isMobile: boolean;
  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 100,
    domLayout: 'autoHeight',
  };
  private gridApi;
  private gridColumnApi;

  constructor(private userService: UserService, public dialog: MatDialog, private deviceService: DeviceDetectorService) {
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

  desktopColumnDefs = [
    {
      headerName: 'User Informations',
      children: [
        // {field: 'id', sortable: true, width: 100, filter: 'agNumberColumnFilter'},
        {field: 'username', sortable: true},
        {valueGetter: this.currentJobGetter, headerName: 'Job', sortable: true, filter: 'agTextColumnFilter'},
        {field: 'age', sortable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open'},
        {field: 'gender', sortable: true, width: 100, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {field: 'education', sortable: true, filter: 'agTextColumnFilter'},
        {field: 'location', sortable: true, filter: 'agTextColumnFilter'},
        {field: 'salaryHistory.totalYearsOfExperience', headerName: 'Work Experience', sortable: true, valueFormatter: this.experienceFormatter, filter: 'agTextColumnFilter'},
      ]
    },
    {
      headerName: 'Salary Informations',
      children: [
        {field: 'salaryHistory.salaryCurrency', hide: true},
        {field: 'salaryHistory.salaryInfos', hide: true},
        {valueGetter: this.totalSalaryValueGetter, width: 150, headerName: 'Total Salary', sortable: true, filter: 'agNumberColumnFilter', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.baseSalaryValueGetter, width: 150, headerName: 'Base Salary', sortable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.bonusSalaryValueGetter, width: 150, headerName: 'Bonus Salary', sortable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.stockSalaryValueGetter, width: 150, headerName: 'Equity', sortable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.increaseValueGetter, width: 250, headerName: 'Increase since beginning', sortable: true, filter: 'agTextColumnFilter'},
      ]
    },
  ];

  experienceFormatter(params) {
    return params.value + ' years'
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.rowData = data;
    })
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  autoColumnSizesWithButton(skipHeader): void {
    const allColumnIds = this.gridColumnApi.getAllColumns().map((column) => column.colId);
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  openUserInfos(event): void {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedUser = selectedNodes.map(node => node.data)[0];
    const dialogRef = this.dialog.open(UserInfosDialogComponent, {
      width: '100%',
      height: '80%',
      data: {selectedUser: selectedUser},
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }

  openSalaryAddingDialog(event): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '100%',
      height: '90%',
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api!.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }
}
