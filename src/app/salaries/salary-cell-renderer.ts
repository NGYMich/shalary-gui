import {Component, OnDestroy} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {NumberService} from "../services/NumberService";

@Component({
  selector: 'salary-cell-renderer',
  template: `
    <div>{{this.renderedSalaryWithCurrency}}</div>
  `,
})
export class SalaryCellRenderer implements ICellRendererAngularComp {
  renderedSalaryWithCurrency;

  constructor(private numberService: NumberService,) {
  }

  agInit(params: any): void {
    let salaryHistory = params.data.salaryHistory;
    let salary = params.value;
    this.renderedSalaryWithCurrency = params.value == 0 ? null : salaryHistory.salaryInfos.length > 0 ? (this.numberService.formatBigNumberWithSpaces(salary) + " " + salaryHistory.salaryCurrency) : null;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
