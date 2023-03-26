import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/user";
import {Country} from "../../../model/country";
import {ColDef, GridOptions} from "ag-grid-community";
import {UserService} from "../../../services/UserService";
import {ForexService} from "../../../services/ForexService";
import {Router} from "@angular/router";
import {CompanyCellRenderer} from "../company-cell-renderer";
import {LocationCellRenderer} from "../location-cell-renderer";
import {SalaryCellRenderer} from "../salary-cell-renderer";
import {JobCellRenderer} from "../job-cell-renderer";
import {ColorHelper, LegendPosition, ScaleType} from "@swimlane/ngx-charts";
import {NumberService} from "../../../services/NumberService";
import {DeviceDetectorService} from "ngx-device-detector";
import {Serie} from "../../../model/serie";
import {JobCellRendererAlternativeView} from "./job-cell-renderer-alternative-view";
import {CompanyCellRendererAlternativeView} from "./company-cell-renderer-alternative-view";
import {TokenStorageService} from "../../../services/TokenStorageService";
import {RegisterComponent} from "../../authentication/register/register.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-salaries-alternative-view',
  templateUrl: './salaries-alternative-view.component.html',
  styleUrls: ['./salaries-alternative-view.component.css']
})
export class SalariesAlternativeViewComponent implements OnInit {

  users: User[] = [];
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

  public activeEntries: any[] = [];
  public chartData: { name: string, series: { name: string, value?: string | number }[] }[];
  public chartNames: string[];
  public colors: ColorHelper;
  public colorScheme: any = {domain: ['#d6dd00', '#ffb160', '#93c47d', '#bd3d16']}; // base , bonus , equity , total
  public yAxisTickFormattingDesktop = this.formatSalary.bind(this);
  public yAxisTickFormattingMobile = this.formatSalaryMobile.bind(this);
  userInfosString: string[] = [];


  constructor(public numberService: NumberService,
              private router: Router,
              private deviceService: DeviceDetectorService,
              private userService: UserService, private forexService: ForexService,
              private tokenStorage: TokenStorageService,
              public dialog: MatDialog,
  ) {
    Object.assign(this, this.dataGraph);
  }


  ngOnInit(): void {
    this.gridOptions.context = {selectedCurrency: this.selectedCurrency}
    this.loadMostPopularCountries();
    this.loadUsers();
    this.loadForexes();
    console.log(this.tokenStorage.getUser());
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

  editOrRemoveExperience() {
    this.router.navigate(['/edit-user-infos'], {state: {chosenUsernameToEdit: this.currentUser.username}});
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
      ((salaryInfo.company != null && salaryInfo.company.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      (salaryInfo.company != null && salaryInfo.company.sector != null) ? ("(" + salaryInfo.company.sector + ")") : "",
      salaryInfo.contractType)))

    bonusSalariesSeries = bonusSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.bonusSalary != null ? salaryInfo.bonusSalary : 0,
      ((salaryInfo.company != null && salaryInfo.company.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      (salaryInfo.company != null && salaryInfo.company.sector != null) ? ("(" + salaryInfo.company.sector + ")") : "",
      salaryInfo.contractType)))

    stockSalariesSeries = stockSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.stockSalary != null ? salaryInfo.stockSalary : 0,
      ((salaryInfo.company != null && salaryInfo.company.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      (salaryInfo.company != null && salaryInfo.company.sector != null) ? ("(" + salaryInfo.company.sector + ")") : "",
      salaryInfo.contractType)))

    totalSalariesSeries = totalSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.totalSalary != null ? salaryInfo.totalSalary : 0,
      ((salaryInfo.company != null && salaryInfo.company.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      (salaryInfo.company != null && salaryInfo.company.sector != null) ? ("(" + salaryInfo.company.sector + ")") : "",
      salaryInfo.contractType)))

    return {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries};
  }

  private addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries: Serie[], bonusSalariesSeries: Serie[], stockSalariesSeries: Serie[], totalSalariesSeries: Serie[]) {
    let salaryHistory = this.currentUser.salaryHistory;
    let lastSalaryInfo = salaryHistory.salaryInfos[salaryHistory.salaryInfos.length - 1];
    let companyName = (lastSalaryInfo.company != null && lastSalaryInfo.company.name !== null) ? lastSalaryInfo.company.name : "";
    let companySector = (lastSalaryInfo.company != null && lastSalaryInfo.company.sector !== null) ? "(" + lastSalaryInfo.company.sector + ")" : "";
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
    paginationPageSize: 14,
    domLayout: 'autoHeight',
    suppressMenuHide: true
  };
  defaultColDef: ColDef = {
    tooltipValueGetter: (params) => {
      return params.value;
      // return "Click to get career graph and more information !";
    }
  };

  c

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

    if (salaryInfos != null) {
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

  desktopColumnDefs = [
    {
      headerName: 'User',
      children: [
        {field: 'id', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open'},
        {field: 'username', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {valueGetter: this.currentJobGetter, headerName: 'Current job', sortable: true, resizable: true, filter: 'agTextColumnFilter'},
        {valueGetter: this.currentCompanyGetter, headerName: 'Current company', sortable: true, resizable: true, filter: 'agTextColumnFilter', cellRendererFramework: CompanyCellRenderer},
        {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open'},
        {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {field: 'lastUpdate', sortable: true, resizable: true, width: 140, filter: 'agTextColumnFilter', columnGroupShow: 'open'},
        {
          field: 'salaryHistory.totalYearsOfExperience',
          headerName: 'Experience',
          sortable: true,
          resizable: true,
          valueFormatter: this.experienceFormatter,
          filter: 'agTextColumnFilter', width: 150,
          cellStyle: params => {
            let experience = params.value;
            switch (true) {
              case (experience < 3):
                return {}
              case (experience < 6):
                return {'background-color': '#BCD2E8'}
              case (experience < 9):
                return {'background-color': '#91BAD6'}
              case (experience >= 9):
                return {'background-color': '#73A5C6'}
            }
            return
          }
        },
        {
          field: 'location', sortable: true, resizable: true, filter: 'agTextColumnFilter',
          cellRendererFramework: LocationCellRenderer,
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
          value: 'totalSalary',
          valueGetter: this.totalSalaryValueGetter.bind(this),
          width: 150,
          editable: true,
          headerName: 'Total salary',
          sortable: true, resizable: true,
          filter: 'agNumberColumnFilter',
          cellRendererFramework: SalaryCellRenderer,
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
        {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'closed', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'closed', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'closed', cellRendererFramework: SalaryCellRenderer},
        {valueGetter: this.increaseValueGetter.bind(this), width: 250, headerName: 'Increase since beginning', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'closed'},
      ]
    },
  ];
  mobileColumnDefs = [
    {field: 'id', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', hide: true},

    {
      valueGetter: this.currentJobGetter, headerName: 'Job', sortable: true, resizable: true, filter: 'agTextColumnFilter',
      cellRendererFramework: JobCellRendererAlternativeView,
      cellStyle: {"white-space": "normal"},
      autoHeight: true,
      width: 280
    },
    {
      valueGetter: this.currentCompanyGetter, headerName: 'Current company', sortable: true, resizable: true, filter: 'agTextColumnFilter',
      cellRendererFramework: CompanyCellRendererAlternativeView,
      cellStyle: {"white-space": "normal"},
      autoHeight: true,
      width: 200
    },

    {field: 'salaryHistory.totalYearsOfExperience', headerName: 'Experience', sortable: true, resizable: true, valueFormatter: this.experienceFormatter, filter: 'agTextColumnFilter', width: 130},
    {
      field: 'location', sortable: true, resizable: true, filter: 'agTextColumnFilter',
      cellRendererFramework: LocationCellRenderer, hide: true
    },

    {field: 'salaryHistory.salaryCurrency', hide: true},
    {field: 'salaryHistory.salaryInfos', hide: true},
    {field: 'salaryHistory', hide: true},
    {
      value: 'totalSalary',
      valueGetter: this.totalSalaryValueGetter.bind(this),
      width: 130,
      editable: true,
      headerName: 'Salary',
      sortable: true, resizable: true,
      filter: 'agNumberColumnFilter',
      cellRendererFramework: SalaryCellRenderer,
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
    {field: 'username', sortable: true, resizable: true, filter: 'agTextColumnFilter', hide: false},
    {field: 'age', sortable: true, resizable: true, width: 100, filter: 'agNumberColumnFilter', columnGroupShow: 'open', hide: true},
    {field: 'gender', sortable: true, resizable: true, width: 100, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true},
    {field: 'education', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: false},
    {field: 'lastUpdate', sortable: true, resizable: true, width: 140, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true},
    {valueGetter: this.baseSalaryValueGetter.bind(this), width: 150, headerName: 'Base salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer, hide: true},
    {valueGetter: this.bonusSalaryValueGetter.bind(this), width: 150, headerName: 'Bonus salary', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer, hide: true},
    {valueGetter: this.stockSalaryValueGetter.bind(this), width: 150, headerName: 'Equity', sortable: true, resizable: true, filter: 'agNumberColumnFilter', columnGroupShow: 'open', cellRendererFramework: SalaryCellRenderer, hide: true},
    {valueGetter: this.increaseValueGetter.bind(this), width: 250, headerName: 'Increase since beginning', sortable: true, resizable: true, filter: 'agTextColumnFilter', columnGroupShow: 'open', hide: true},

  ];


  experienceFormatter(params) {
    return params.value + ' years'
  }

  loadUsers() {
    this.userService.getUsersWithSalaryHistory().subscribe((users: User[]) => {
      this.rowData = users;
      this.currentUser = users[0];
      this.salaryCurrency = this.currentUser.salaryHistory.salaryCurrency
      if (this.currentUser.salaryHistory.salaryInfos.length > 0) {
        this.dataGraph = []
        this.mostRecentJobName = this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1]?.jobName
        let {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries} = this.computeSalariesSeries();

        this.addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
        this.addSalariesSeriesToDataGraph(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
        this.constructUserInfosString();

      }
    })
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
    // console.log(this.gridApi.forEachNode(node => node.rowIndex ? 0 : node.setSelected(true)))

    // setTimeout(() => {
    //   this.openUserInfos(null)
    // }, 1500)

  }

  openSignupDialog(event): void {
    let dialogRef = this.dialog.open(RegisterComponent, {
      width: '500px',
      height: '620px',
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
      let rate = (pair in this.forexRates) ? this.forexRates[pair] : 1
      return totalSalary != null ? (Math.ceil(totalSalary * rate / 100) * 100).toFixed(0) : totalSalary;
    } else {
      return totalSalary
    }
  }

  openUserInfos(event): void {
    this.currentUser = this.gridApi.getSelectedNodes().map(node => node.data)[0];
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
}

