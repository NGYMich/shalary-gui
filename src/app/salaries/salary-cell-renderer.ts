import {Component, OnDestroy} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'salary-cell-renderer',
  template: `
    <div>{{this.renderedSalaryWithCurrency}}</div>
  `,
})
export class SalaryCellRenderer implements ICellRendererAngularComp, OnDestroy {
  renderedSalaryWithCurrency;

  agInit(params: any): void {
    let salaryHistory = params.data.salaryHistory;
    let salary = params.value;
    this.renderedSalaryWithCurrency = params.value == 0 ? null : salaryHistory.salaryInfos.length > 0 ? (salary.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + " " + salaryHistory.salaryCurrency) : null;
  }

  ngOnDestroy() {
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
