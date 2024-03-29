import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/user";
import {Country} from "../../../model/country";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import {UserService} from "../../../services/UserService";
import {ForexService} from "../../../services/ForexService";
import {Router} from "@angular/router";
import {LocationCellRenderer} from "../cell-renderers/location-cell-renderer";
import {SalaryCellRenderer} from "../cell-renderers/salary-cell-renderer";
import {ColorHelper, LegendPosition, ScaleType} from "@swimlane/ngx-charts";
import {NumberService} from "../../../services/NumberService";
import {DeviceDetectorService} from "ngx-device-detector";
import {Serie} from "../../../model/serie";
import {JobCellRendererAlternativeView} from "../cell-renderers/job-cell-renderer-alternative-view";
import {CompanyCellRendererAlternativeView} from "../cell-renderers/company-cell-renderer-alternative-view";
import {TokenStorageService} from "../../../services/TokenStorageService";
import {RegisterComponent} from "../../authentication/register/register.component";
import {MatDialog} from "@angular/material/dialog";
import {AppConstants} from "../../global/common-variables";
import {Location} from "@angular/common";
import {SalaryInfo} from "../../../model/salaryInfo";
import {UserInfosDialogComponent} from "../../../user-infos/user-infos-dialog/user-infos-dialog.component";
import {TipsAndTricksDialogComponent} from "../../../user-infos/tips-and-tricks-dialog/tips-and-tricks-dialog.component";
import {filterParams, getDefaultCellStyle, globalAgGridStyleDependingOnBlur, globalHideLegendsBecauseOfBlur, ROW_INDEX_TO_BLUR, totalSalaryCellStyle, totalYearsOfExperienceCellStyle} from "../../global/cell-style";


@Component({
  selector: 'app-salaries-alternative-view',
  templateUrl: './careers-graphical-view.html',
  styleUrls: ['./careers-graphical-view.css'],
})
export class CareersGraphicalView implements OnInit {

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
  salaryHistory: any;
  currentUser: User;

  view: [number, number] = [1000, 500];
  dataGraph: any = [];
  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Years of experience';
  yAxisLabel: string = 'Salary';
  timeline: boolean = true;
  showGridLines: boolean = true;
  mostRecentJobName: string;
  legendPosition = LegendPosition.Below;
  salaryCurrency;
  isMobile: boolean;
  showProgressBar: any = true;
  isUserInfoDivOpen: boolean = true;
  isLoggedIn: boolean = false;

  public activeEntries: any[] = [];
  public chartNames: string[];
  public colors: ColorHelper;
  public colorScheme: any = {domain: ['crimson', 'orange', 'darkgreen', 'darkblue']}; // total, base, bonus, equity
  public yAxisTickFormattingDesktop = this.formatSalary.bind(this);
  public yAxisTickFormattingMobile = this.formatSalaryMobile.bind(this);
  userInfosString: string[] = [];
  chosenCountryFromHomePage: any = null;
  selectedUserRowIndex: any = 0;
  defaultColDef: ColDef = {
    filterParams: filterParams,
    sortable: true,
    resizable: true,
  };


  constructor(public numberService: NumberService,
              private router: Router,
              private deviceService: DeviceDetectorService,
              private userService: UserService, private forexService: ForexService,
              private tokenStorageService: TokenStorageService,
              public dialog: MatDialog,
              private location: Location,
  ) {

    Object.assign(this, this.dataGraph);
    Object.entries(location.getState() as Map<any, any>).map(([key, value]) => {
      if (key == "chosenCountry") this.chosenCountryFromHomePage = value;
    })

  }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.getUser() != null && this.tokenStorageService.getUser() != ""
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency}
    this.loadMostPopularCountries();
    if (this.chosenCountryFromHomePage != null) {
      console.log('chosen country : ' + this.chosenCountryFromHomePage)
      this.loadUsersWithSalaryHistoryFromCountry(this.chosenCountryFromHomePage);
    } else {
      this.loadUsersWithSalaryHistory();
    }
    this.loadForexes();

  }


  private constructUserInfosString() {
    this.userInfosString = []

    let location;
    if (this.currentUser.location != null) {
      location = this.currentUser.location
      if (this.currentUser.city != null) {
        location += (" (" + this.currentUser.city + ")")
      }
    }
    if (this.currentUser.gender != null && this.currentUser.gender != "") this.userInfosString.push(this.currentUser.gender)
    if (this.currentUser.age != null) this.userInfosString.push(this.currentUser.age.toString() + " years old")
    if (this.currentUser.location != null && this.currentUser.location != "") this.userInfosString.push(location)
    if (this.currentUser.education != null && this.currentUser.education != "") this.userInfosString.push(this.currentUser.education)
  }

  formatSalary(val) {
    return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + " " + this.numberService.formatCurrency(this.salaryCurrency);
    // return val
  }

  formatSalaryMobile(val) {
    return this.numberService.nFormatter(val, 2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + " " + this.numberService.formatCurrency(this.salaryCurrency);
  }

  public legendLabelActivate(item: any): void {
    this.activeEntries = item.value === undefined ? [item] : [{name: item.value.name}];
  }

  public legendLabelDeactivate(item: any): void {
    this.activeEntries = [];
  }

  onSelect($event: any) {

  }

  private addSalariesSeriesToDataGraph(baseSalariesSeries: Serie[], bonusSalariesSeries: Serie[], stockSalariesSeries: Serie[], totalSalariesSeries: Serie[]) {
    this.colors = new ColorHelper(this.colorScheme, ScaleType.Ordinal, this.dataGraph, (this.colorScheme));
    if (this.isMobile) {
      this.dataGraph.push({name: 'Total Salary (base + bonus + equity)', series: totalSalariesSeries})
      this.dataGraph.push({name: 'Base Salary', series: baseSalariesSeries})
      this.dataGraph.push({name: 'Bonus Salary', series: bonusSalariesSeries})
      this.dataGraph.push({name: 'Equity', series: stockSalariesSeries})
    } else {
      this.dataGraph.push({name: 'Total Salary (base + bonus + equity)', series: totalSalariesSeries})
      this.dataGraph.push({name: 'Base Salary', series: baseSalariesSeries})
      this.dataGraph.push({name: 'Bonus Salary (signing, performance, gym, insurance, transports, rent..)', series: bonusSalariesSeries})
      this.dataGraph.push({name: 'Equity (options, restricted stock, performance shares)', series: stockSalariesSeries})
    }

    this.chartNames = this.dataGraph.map((d: any) => d.name);
  }

  private computeSalariesSeries() {
    let salaryInfos = this.currentUser.salaryHistory.salaryInfos;
    let salaryCurrency = this.currentUser.salaryHistory.salaryCurrency != null ? this.numberService.formatCurrency(this.currentUser.salaryHistory.salaryCurrency) : "";
    let baseSalariesSeries: Serie[] = []
    let bonusSalariesSeries: Serie[] = []
    let stockSalariesSeries: Serie[] = []
    let totalSalariesSeries: Serie[] = []

    if (salaryInfos[0].yearsOfExperience != 0.0) {
      baseSalariesSeries = [new Serie(0.0.toString(), 0, "", "", "", "", "")]
      bonusSalariesSeries = [new Serie(0.0.toString(), 0, "", "", "", "", "")]
      stockSalariesSeries = [new Serie(0.0.toString(), 0, "", "", "", "", "")]
      totalSalariesSeries = [new Serie(0.0.toString(), 0, "", "", "", "", "")]
    }


    baseSalariesSeries = baseSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.baseSalary != null ? salaryInfo.baseSalary : 0,
      ((salaryInfo.company?.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      this.getCompanySector(salaryInfo),
      salaryInfo.contractType)))

    bonusSalariesSeries = bonusSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.bonusSalary != null ? salaryInfo.bonusSalary : 0,
      ((salaryInfo.company?.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      this.getCompanySector(salaryInfo),
      salaryInfo.contractType)))

    stockSalariesSeries = stockSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.stockSalary != null ? salaryInfo.stockSalary : 0,
      ((salaryInfo.company?.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      this.getCompanySector(salaryInfo),
      salaryInfo.contractType)))

    totalSalariesSeries = totalSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.totalSalary != null ? salaryInfo.totalSalary : 0,
      ((salaryInfo.company?.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      this.getCompanySector(salaryInfo),
      salaryInfo.contractType)))

    return {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries};
  }

  private getCompanySector(salaryInfo: SalaryInfo) {
    return (salaryInfo.company?.sector?.length > 0) ? ("(" + salaryInfo.company.sector + ")") : "";
  }

  private addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries: Serie[], bonusSalariesSeries: Serie[], stockSalariesSeries: Serie[], totalSalariesSeries: Serie[]) {
    let salaryHistory = this.currentUser.salaryHistory;
    let lastSalaryInfo = salaryHistory.salaryInfos[salaryHistory.salaryInfos.length - 1];
    let companyName = (lastSalaryInfo.company?.name !== null) ? lastSalaryInfo.company.name : "";
    let companySector = (lastSalaryInfo.company?.sector?.length > 0) ? "(" + lastSalaryInfo.company.sector + ")" : "";
    let contractType = (lastSalaryInfo.contractType != null) ? lastSalaryInfo.contractType : ""

    let salaryCurrency = salaryHistory.salaryCurrency != null ? this.numberService.formatCurrency(this.currentUser.salaryHistory.salaryCurrency) : "";
    let latestJobName = lastSalaryInfo.jobName
    baseSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.baseSalary, companyName, salaryCurrency, latestJobName, companySector, contractType));
    bonusSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.bonusSalary, companyName, salaryCurrency, latestJobName, companySector, contractType));
    stockSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.stockSalary, companyName, salaryCurrency, latestJobName, companySector, contractType));
    totalSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.totalSalary, companyName, salaryCurrency, latestJobName, companySector, contractType));
  }


  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    suppressPaginationPanel: !(this.tokenStorageService.getUser() != null && this.tokenStorageService.getUser() != ""),
    paginationPageSize: 13,
    domLayout: 'autoHeight',
    rowHeight: 70,
    suppressMenuHide: true,
  };


  totalSalaryValueGetter(params) {
    if (params.salaryHistory !== null) {
      let totalSalary = params.getValue('salaryHistory.salaryInfos').length > 0 ? Number((params.getValue('salaryHistory.salaryInfos'))[params.getValue('salaryHistory.salaryInfos').length - 1].totalSalary) : null;
      return this.applyRateToSalary(params, totalSalary);
    } else {
      return ''
    }
  };

  baseSalaryValueGetter(params) {
    if (params.salaryHistory !== null) {
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

    if (salaryInfos?.length > 0) {
      let latestCompany = salaryInfos[salaryInfos.length - 1].company;
      if (salaryInfos.length > 0 && latestCompany != null) {
        if (latestCompany.sector?.length > 0) {
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

  locationValueGetter = function (params) {
    console.log(params)
    return params.data.location
  }

  desktopColumnDefs: (ColDef | ColGroupDef)[] | null | undefined = [
    {
      field: 'id', width: 80, filter: 'agNumberColumnFilter', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),
    },

    {
      valueGetter: this.currentJobGetter, headerName: 'Job', filter: 'agTextColumnFilter',
      cellRenderer: JobCellRendererAlternativeView, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),
      autoHeight: true,
      width: 280
    },
    {
      valueGetter: this.currentCompanyGetter, headerName: 'Current company', filter: 'agTextColumnFilter',
      cellRenderer: CompanyCellRendererAlternativeView,
      cellStyle: params => {
        let copyVerticalAlignColumn = {...(getDefaultCellStyle(params, this.isLoggedIn))};
        copyVerticalAlignColumn["font-weight"] = '600'
        return copyVerticalAlignColumn;
      },
      autoHeight: true,
      width: 250
    },
    {
      field: 'salaryHistory.salaryCurrency', hide: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),
    },
    {
      field: 'salaryHistory.salaryInfos', headerName: 'Companies List', hide: true, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,),
      getQuickFilterText: params => {
        return params.value.map(salaryInfo => salaryInfo.company.name).join(", ");
      }
    },
    {
      field: 'salaryHistory.salaryInfos', headerName: 'Jobs List', hide: true, filter: 'agTextColumnFilter', autoHeight: true, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn,),
      getQuickFilterText: params => {
        return params.value.map(salaryInfo => salaryInfo.jobName).join(", ");
      }
    },
    {field: 'salaryHistory', hide: true,},
    {
      valueGetter: this.totalSalaryValueGetter.bind(this),
      width: 130,
      editable: true,
      headerName: 'Salary',

      filter: 'agNumberColumnFilter',
      cellRenderer: SalaryCellRenderer,
      cellRendererParams: {selectedCurrency: this.selectedCurrency},
      cellStyle: params => totalSalaryCellStyle(params, this.isLoggedIn)

    },
    {
      field: 'salaryHistory.totalYearsOfExperience',
      headerName: 'Experience',


      valueFormatter: this.experienceFormatter,
      filter: 'agTextColumnFilter',
      width: 120,
      cellStyle: params => totalYearsOfExperienceCellStyle(params, this.isLoggedIn),
    },

    {
      valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', filter: 'agNumberColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open', cellRenderer: SalaryCellRenderer, hide: false,
    },
    {
      valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', filter: 'agNumberColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open', cellRenderer: SalaryCellRenderer, hide: false
    },
    {
      valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', filter: 'agNumberColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open', cellRenderer: SalaryCellRenderer, hide: false
    },
    {
      valueGetter: this.increaseValueGetter.bind(this), width: 250, headerName: 'Increase since beginning', filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open', hide: false
    },
    {
      field: 'username', filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), hide: false
    },
    {
      field: 'age', width: 100, filter: 'agNumberColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open', hide: false
    },
    {
      field: 'gender', width: 100, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open', hide: true
    },
    {
      field: 'education', filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open', hide: false
    },
    {
      valueGetter: this.locationValueGetter, headerName: 'Location', filter: 'agTextColumnFilter',
      cellRenderer: LocationCellRenderer, hide: false, cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn),
    },
    {
      field: 'modifiedDate', width: 140, filter: 'agTextColumnFilter', cellStyle: params => getDefaultCellStyle(params, this.isLoggedIn), columnGroupShow: 'open', hide: true
    },


  ];
  ROW_INDEX_TO_BLUR = ROW_INDEX_TO_BLUR;


  experienceFormatter(params) {
    return params.value + ' years'
  }

  loadUsersWithSalaryHistory() {
    this.userService.getUsersWithSalaryHistory().subscribe((users: User[]) => {
      this.constructUserInfosGraph(users);
    })
  }

  loadUsersWithSalaryHistoryFromCountry(country: string) {
    this.userService.getUsersWithSalaryHistoryByCountry(country).subscribe((users: User[]) => {
      this.constructUserInfosGraph(users);
    })
  }

  private constructUserInfosGraph(users: User[]) {
    this.rowData = users.slice(0, 500);
    if (users.length > 0) {
      this.currentUser = users[0];
      if (this.currentUser.salaryHistory != null) {
        this.salaryCurrency = this.currentUser.salaryHistory.salaryCurrency
        if (this.currentUser.salaryHistory.salaryInfos.length > 0) {
          this.dataGraph = []
          this.mostRecentJobName = this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1]?.jobName
          let {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries} = this.computeSalariesSeries();
          this.addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
          this.addSalariesSeriesToDataGraph(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
          this.constructUserInfosString();
        }
      }
    }
    this.showProgressBar = false;

  }

  loadForexes() {
    this.forexService.getTopForexRates().subscribe((forexes: any) => {
      this.forexRates = forexes;
    })
  }

  loadMostPopularCountries() {
    this.userService.getMostPopularCountriesFromUsers().subscribe((mostPopularCountries: Country[]) => {
      this.mostPopularCountries = mostPopularCountries;
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
    this.gridApi.getRowNode(0).selectThisNode(true);
  }

  openSignupDialog(event): void {
    let dialogRef = this.dialog.open(RegisterComponent, {
      width: AppConstants.SIGN_UP_DIALOG_WIDTH,
      height: AppConstants.SIGN_UP_DIALOG_HEIGHT,
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
    this.selectedCurrency = this.selectedCurrency != currency ? this.selectedCurrency = currency.trim() : "DEFAULT";
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency}
    this.gridApi.refreshCells(this.gridApi.columns);
  }

  private applyRateToSalary(params, totalSalary: number | null) {
    if (params.data.salaryHistory?.salaryCurrency?.substring(0, 3) != this.selectedCurrency && this.selectedCurrency != 'DEFAULT') {
      let pair = params.data.salaryHistory.salaryCurrency.substring(0, 3) + "_" + this.selectedCurrency
      let rate = (pair in this.forexRates) ? this.forexRates[pair] : 1
      return totalSalary != null ? (Math.ceil(totalSalary * rate / 100) * 100).toFixed(0) : totalSalary;
    } else {
      return totalSalary
    }
  }

  openUserInfos(event): void {
    this.currentUser = this.gridApi.getSelectedNodes().map(node => node.data)[0];
    this.selectedUserRowIndex = this.gridApi.getSelectedNodes()[0].rowIndex;
    console.log("selected user", this.selectedUserRowIndex)

    this.updateDataGraph();
  }

  private updateDataGraph() {
    this.salaryCurrency = this.currentUser.salaryHistory.salaryCurrency
    if (this.currentUser.salaryHistory.salaryInfos.length > 0) {
      this.dataGraph = []
      this.mostRecentJobName = this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1]?.jobName
      let {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries} = this.computeSalariesSeries();

      this.addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
      this.addSalariesSeriesToDataGraph(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
      this.constructUserInfosString();

    }
  }

  openOrCloseUserInfosDiv() {
    this.isUserInfoDivOpen = !this.isUserInfoDivOpen
  }

  openUserInfosDialog(event): void {
    this.selectedUserRowIndex = this.gridApi.getSelectedNodes()[0].rowIndex;
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedUser = selectedNodes.map(node => node.data)[0];
    this.dialog.open(UserInfosDialogComponent, {
      width: '100%',
      height: '80%',
      data: {
        selectedUser: selectedUser,
        selectedRowIndex: this.selectedUserRowIndex,
      },
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel', 'custom-dialog-container']
    });
  }

  openTipsAndTricksDialog() {
    this.dialog.open(TipsAndTricksDialogComponent, {
      width: '100%',
      height: '82%',
      data: {isUserInfoDivOpen: this.isUserInfoDivOpen},
      autoFocus: false,
      panelClass: ['animate__animated', 'animate__zoomIn__fast', 'my-panel', 'custom-dialog-container']
    });

  }

  returnAgGridStyleDependingOnBlur() {
    return globalAgGridStyleDependingOnBlur(this.isLoggedIn, this.selectedUserRowIndex);
  }

  hideLegendsBecauseOfBlur() {
    return globalHideLegendsBecauseOfBlur(this.isLoggedIn, this.selectedUserRowIndex)
  }
}

