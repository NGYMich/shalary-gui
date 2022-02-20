import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {User} from "../../model/user";
import {Serie} from "../../model/serie";

@Component({
  selector: 'app-user-infos-dialog',
  templateUrl: './user-infos-dialog.component.html',
  styleUrls: ['./user-infos-dialog.component.css']
})
export class UserInfosDialogComponent implements OnInit {
  salaryHistory: any;
  currentUser: User;

  view: [number, number] = [1280, 600];
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
  showGridLines: boolean = false;
  mostRecentJobName: string;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    Object.assign(this, this.dataGraph);
  }

  ngOnInit(): void {
    this.currentUser = this.data.selectedUser;
    this.yAxisLabel = 'Salary (' + this.currentUser.salaryHistory.salaryCurrency + ')';
    if (this.currentUser.salaryHistory.salaryInfos.length > 0) {
      this.mostRecentJobName = this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1]?.jobName
      let {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries} = this.computeSalariesSeries();
      this.addLastLinePointWithTotalYearsOfExperience(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
      this.addSalariesSeriesToDataGraph(baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries);
    }
  }


  private addSalariesSeriesToDataGraph(baseSalariesSeries: Serie[], bonusSalariesSeries: Serie[], stockSalariesSeries: Serie[], totalSalariesSeries: Serie[]) {

    this.dataGraph.push({
      name: 'Base Salary',
      series: baseSalariesSeries
    })

    if (bonusSalariesSeries.find(bonusSalary => bonusSalary.value > 0)) {
      this.dataGraph.push({
        name: 'Bonus Salary',
        series: bonusSalariesSeries
      })
    }
    if (stockSalariesSeries.find(stockSalary => stockSalary.value > 0)) {
      this.dataGraph.push({
        name: 'Stock Salary',
        series: stockSalariesSeries
      })
    }

    if (bonusSalariesSeries.find(bonusSalary => bonusSalary.value > 0) || stockSalariesSeries.find(stockSalary => stockSalary.value > 0)) {
      this.dataGraph.push({
        name: 'Total Salary',
        series: totalSalariesSeries
      })
    }
  }

  private computeSalariesSeries() {
    let baseSalariesSeries = this.currentUser.salaryHistory.salaryInfos.map(salaryInfo => {
      return new Serie(
        String(salaryInfo.yearsOfExperience),
        salaryInfo.baseSalary
      )
    })

    let bonusSalariesSeries = this.currentUser.salaryHistory.salaryInfos.map(salaryInfo => {
      return new Serie(
        String(salaryInfo.yearsOfExperience),
        salaryInfo.bonusSalary
      )
    })
    let stockSalariesSeries = this.currentUser.salaryHistory.salaryInfos.map(salaryInfo => {
      return new Serie(
        String(salaryInfo.yearsOfExperience),
        salaryInfo.stockSalary
      )
    })

    let totalSalariesSeries = this.currentUser.salaryHistory.salaryInfos.map(salaryInfo => {
      return new Serie(
        String(salaryInfo.yearsOfExperience),
        salaryInfo.totalSalary
      )
    })
    return {baseSalariesSeries, bonusSalariesSeries, stockSalariesSeries, totalSalariesSeries};
  }

  private addLastLinePointWithTotalYearsOfExperience(baseSalariesSeries: Serie[], bonusSalariesSeries: Serie[], stockSalariesSeries: Serie[], totalSalariesSeries: Serie[]) {
    baseSalariesSeries.push(
      new Serie(
        String(this.currentUser.salaryHistory.totalYearsOfExperience),
        this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1].baseSalary
      ));
    bonusSalariesSeries.push(
      new Serie(
        String(this.currentUser.salaryHistory.totalYearsOfExperience),
        this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1].bonusSalary
      ));
    stockSalariesSeries.push(
      new Serie(
        String(this.currentUser.salaryHistory.totalYearsOfExperience),
        this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1].stockSalary
      ));
    totalSalariesSeries.push(
      new Serie(
        String(this.currentUser.salaryHistory.totalYearsOfExperience),
        this.currentUser.salaryHistory.salaryInfos[this.currentUser.salaryHistory.salaryInfos.length - 1].totalSalary
      ));
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
