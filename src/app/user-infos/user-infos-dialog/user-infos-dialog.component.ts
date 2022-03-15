import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {User} from "../../model/user";
import {Serie} from "../../model/serie";
import {ColorHelper, LegendPosition, ScaleType} from "@swimlane/ngx-charts";
import {NumberService} from "../../services/NumberService";

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
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Years of experience';
  yAxisLabel: string = 'Salary';
  timeline: boolean = true;
  showGridLines: boolean = true;
  mostRecentJobName: string;
  legendPosition: LegendPosition = LegendPosition.Below;
  salaryCurrency;

  public activeEntries: any[] = [];
  public chartData: { name: string, series: { name: string, value?: string | number }[] }[];
  public chartNames: string[];
  public colors: ColorHelper;
  public colorScheme: any = {domain: ['#d6dd00', '#ffb160', '#93c47d', '#bd3d16']}; // base , bonus , equity , total
  public yAxisTickFormattingFn = this.formatSalary.bind(this);


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public numberService: NumberService) {
    Object.assign(this, this.dataGraph);
    this.salaryCurrency = this.data.selectedUser.salaryHistory.salaryCurrency
  }


  ngOnInit(): void {
    this.currentUser = this.data.selectedUser;
    if (this.currentUser.salaryHistory.salaryInfos.length > 0) {
      this.mostRecentJobName = this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1]?.jobName
      let {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries} = this.computeSalariesSeries();
      this.addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
      this.addSalariesSeriesToDataGraph(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
    }
  }

  formatSalary(val) {
    return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + " " + this.salaryCurrency;
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
    this.dataGraph.push({name: 'Total Salary (base + bonus + equity)', series: totalSalariesSeries})
    this.dataGraph.push({name: 'Base Salary', series: baseSalariesSeries})
    this.dataGraph.push({name: 'Bonus Salary (signing, performance, gym, insurance, transports, rent..)', series: bonusSalariesSeries})
    this.dataGraph.push({name: 'Equity (options, restricted stock, performance shares)', series: stockSalariesSeries})
    this.chartNames = this.dataGraph.map((d: any) => d.name);
  }

  private computeSalariesSeries() {
    let salaryInfos = this.currentUser.salaryHistory.salaryInfos;
    let salaryCurrency = this.currentUser.salaryHistory.salaryCurrency != null ? this.currentUser.salaryHistory.salaryCurrency : "";
    let baseSalariesSeries = salaryInfos.map(salaryInfo => new Serie(String(salaryInfo.yearsOfExperience), salaryInfo.baseSalary != null ? salaryInfo.baseSalary : 0, (salaryInfo.company != null && salaryInfo.company.name != null) ? salaryInfo.company.name : "", salaryCurrency, salaryInfo.jobName))
    let bonusSalariesSeries = salaryInfos.map(salaryInfo => new Serie(String(salaryInfo.yearsOfExperience), salaryInfo.bonusSalary != null ? salaryInfo.bonusSalary : 0, (salaryInfo.company != null && salaryInfo.company.name != null) ? salaryInfo.company.name : "", salaryCurrency, salaryInfo.jobName))
    let stockSalariesSeries = salaryInfos.map(salaryInfo => new Serie(String(salaryInfo.yearsOfExperience), salaryInfo.stockSalary != null ? salaryInfo.stockSalary : 0, (salaryInfo.company != null && salaryInfo.company.name != null) ? salaryInfo.company.name : "", salaryCurrency, salaryInfo.jobName))
    let totalSalariesSeries = salaryInfos.map(salaryInfo => new Serie(String(salaryInfo.yearsOfExperience), salaryInfo.totalSalary != null ? salaryInfo.totalSalary : 0, (salaryInfo.company != null && salaryInfo.company.name != null) ? salaryInfo.company.name : "", salaryCurrency, salaryInfo.jobName))
    return {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries};
  }

  private addLastGraphPointWithTotalYearsOfExperience(baseSalariesSeries: Serie[], bonusSalariesSeries: Serie[], stockSalariesSeries: Serie[], totalSalariesSeries: Serie[]) {
    let salaryHistory = this.currentUser.salaryHistory;
    let lastSalaryInfo = salaryHistory.salaryInfos[salaryHistory.salaryInfos.length - 1];
    let companyName = (lastSalaryInfo.company != null && lastSalaryInfo.company.name !== null) ? lastSalaryInfo.company.name : "";
    let salaryCurrency = salaryHistory.salaryCurrency != null ? this.currentUser.salaryHistory.salaryCurrency : "";
    let latestJobName = lastSalaryInfo.jobName
    baseSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.baseSalary, companyName, salaryCurrency, latestJobName));
    bonusSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.bonusSalary, companyName, salaryCurrency, latestJobName));
    stockSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.stockSalary, companyName, salaryCurrency, latestJobName));
    totalSalariesSeries.push(new Serie(String(salaryHistory.totalYearsOfExperience), lastSalaryInfo.totalSalary, companyName, salaryCurrency, latestJobName));
  }
}
