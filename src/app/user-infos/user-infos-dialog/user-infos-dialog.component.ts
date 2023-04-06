import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../model/user";
import {Serie} from "../../model/serie";
import {ColorHelper, LegendPosition, ScaleType} from "@swimlane/ngx-charts";
import {NumberService} from "../../services/NumberService";
import {Router} from "@angular/router";
import {DeviceDetectorService} from "ngx-device-detector";
import {commonNgxGraphColorScheme} from "../../routes/global/common-variables";
import {TokenStorageService} from "../../services/TokenStorageService";
import {globalAgGridStyleDependingOnBlur, globalHideLegendsBecauseOfBlur} from 'src/app/routes/global/cell-style';

@Component({
  selector: 'app-user-infos-dialog',
  templateUrl: './user-infos-dialog.component.html',
  styleUrls: ['./user-infos-dialog.component.css']
})
export class UserInfosDialogComponent implements OnInit {
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
  below = LegendPosition.Below;
  salaryCurrency;
  isMobile: boolean;
  chosenUserRowIndex: any = 0;
  isLoggedIn: boolean = false;

  public activeEntries: any[] = [];
  public chartData: { name: string, series: { name: string, value?: string | number }[] }[];
  public chartNames: string[];
  public colors: ColorHelper;
  public colorScheme: any = commonNgxGraphColorScheme;
  public yAxisTickFormattingDesktop = this.formatSalary.bind(this);
  public yAxisTickFormattingMobile = this.formatSalaryMobile.bind(this);
  userInfosString: string[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public numberService: NumberService, private router: Router, public dialogRef: MatDialogRef<UserInfosDialogComponent>, private deviceService: DeviceDetectorService, private tokenStorageService: TokenStorageService,
  ) {
    Object.assign(this, this.dataGraph);
    this.salaryCurrency = this.data.selectedUser.salaryHistory.salaryCurrency
    this.chosenUserRowIndex = this.data.selectedRowIndex
  }


  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.getUser() != null && this.tokenStorageService.getUser() != ""
    this.currentUser = this.data.selectedUser;
    this.isMobile = this.deviceService.isMobile();

    if (this.currentUser.salaryHistory.salaryInfos.length > 0) {
      this.mostRecentJobName = this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1]?.jobName
      let {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries} = this.computeSalariesSeries();

      // console.log(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries)
      this.addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
      this.addSalariesSeriesToDataGraph(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
    }
    this.constructUserInfosString();
  }


  private constructUserInfosString() {
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
      (salaryInfo.company?.sector != null) ? ("(" + salaryInfo.company.sector + ")") : "",
      salaryInfo.contractType)))

    bonusSalariesSeries = bonusSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.bonusSalary != null ? salaryInfo.bonusSalary : 0,
      ((salaryInfo.company?.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      (salaryInfo.company?.sector != null) ? ("(" + salaryInfo.company.sector + ")") : "",
      salaryInfo.contractType)))

    stockSalariesSeries = stockSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.stockSalary != null ? salaryInfo.stockSalary : 0,
      ((salaryInfo.company?.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      (salaryInfo.company?.sector != null) ? ("(" + salaryInfo.company.sector + ")") : "",
      salaryInfo.contractType)))

    totalSalariesSeries = totalSalariesSeries.concat(salaryInfos.map(salaryInfo => new Serie(
      String(salaryInfo.yearsOfExperience),
      salaryInfo.totalSalary != null ? salaryInfo.totalSalary : 0,
      ((salaryInfo.company?.name != null) ? salaryInfo.company.name : ""),
      salaryCurrency,
      salaryInfo.jobName,
      (salaryInfo.company?.sector != null) ? ("(" + salaryInfo.company.sector + ")") : "",
      salaryInfo.contractType)))

    return {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries};
  }

  private addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries: Serie[], bonusSalariesSeries: Serie[], stockSalariesSeries: Serie[], totalSalariesSeries: Serie[]) {
    let salaryHistory = this.currentUser.salaryHistory;
    let lastSalaryInfo = salaryHistory.salaryInfos[salaryHistory.salaryInfos.length - 1];
    let companyName = (lastSalaryInfo.company?.name !== null) ? lastSalaryInfo.company.name : "";
    let companySector = (lastSalaryInfo.company?.sector !== null) ? "(" + lastSalaryInfo.company.sector + ")" : "";
    let contractType = (lastSalaryInfo.contractType != null) ? lastSalaryInfo.contractType : ""

    let salaryCurrency = salaryHistory.salaryCurrency != null ? this.numberService.formatCurrency(this.currentUser.salaryHistory.salaryCurrency) : "";
    let latestJobName = lastSalaryInfo.jobName
    baseSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.baseSalary, companyName, salaryCurrency, latestJobName, companySector, contractType));
    bonusSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.bonusSalary, companyName, salaryCurrency, latestJobName, companySector, contractType));
    stockSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.stockSalary, companyName, salaryCurrency, latestJobName, companySector, contractType));
    totalSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.totalSalary, companyName, salaryCurrency, latestJobName, companySector, contractType));
  }


  returnAgGridStyleDependingOnBlur() {
    console.log('opening dialog for user' + this.chosenUserRowIndex)
    return globalAgGridStyleDependingOnBlur(this.isLoggedIn, this.chosenUserRowIndex);
  }

  hideLegendsBecauseOfBlur() {
    return globalHideLegendsBecauseOfBlur(this.isLoggedIn, this.chosenUserRowIndex)
  }
}
