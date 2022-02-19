import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../services/UserService";
import {User} from "../model/user";
import {ColDef, GridOptions} from "ag-grid-community";
import {MatDialog} from "@angular/material/dialog";
import {DeviceDetectorService} from 'ngx-device-detector';
import {UserInfosDialogComponent} from "../user-infos/user-infos-dialog/user-infos-dialog.component";
import {AddUserDialogComponent} from "../user-infos/add-user-dialog/add-user-dialog.component";

@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.css']
})
export class SalariesComponent implements OnInit {

  users: User[] = [];
  @Input() rowData: any;
  @Input() isMobile: boolean;
  private gridApi;
  private gridColumnApi;
  salaryValueGetter = function (params) {
    let salaryInfos = params.getValue('salaryHistory.salaryInfos');
    if (salaryInfos.length > 0) {
      return Number(salaryInfos[salaryInfos.length - 1].totalSalary).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " " + params.getValue('salaryHistory.salaryCurrency');
    } else {
      return null;
    }
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

  desktopColumnDefs: ColDef[] = [
    {field: 'id', sortable: true, width: 50},
    {field: 'username', sortable: true},
    {valueGetter: this.currentJobGetter, headerName: 'Job', sortable: true},
    {field: 'age', sortable:true, width: 75},
    {field: 'gender', sortable: true, width: 100},
    {field: 'education', sortable: true},
    {field: 'location', sortable: true},
    {field: 'salaryHistory.salaryCurrency', hide: true},
    {field: 'salaryHistory.salaryInfos', hide: true},
    {field: 'salaryHistory.totalYearsOfExperience', headerName: 'Experience', sortable: true, valueFormatter: this.experienceFormatter},
    {valueGetter: this.salaryValueGetter, headerName: 'Current Salary', sortable: true},
    {valueGetter: this.increaseValueGetter, headerName: 'Increase since beginning', sortable: true},
  ];

  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 15,
    domLayout: 'autoHeight'
  };

  constructor(private userService: UserService, public dialog: MatDialog, private deviceService: DeviceDetectorService) {
  }

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
      height: '80%',
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel']
    });
  }
}
