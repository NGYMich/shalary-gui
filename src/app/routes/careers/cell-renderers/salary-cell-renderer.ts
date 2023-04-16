import {Component} from "@angular/core";
import {ICellEditorAngularComp, ICellRendererAngularComp} from "ag-grid-angular";
import {NumberService} from "../../../services/NumberService";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'salary-cell-renderer',
  template: `
    {{this.renderedSalaryWithCurrency}}
  `,
})
export class SalaryCellRenderer implements ICellRendererAngularComp {

  renderedSalaryWithCurrency;
  params: ICellRendererParams;
  data: any;

  constructor(private numberService: NumberService) {
  }

  agInit(params: any): void {
    this.params = params;
    this.data = params?.data

    let salaryCurrency = this.data.salaryHistory.salaryCurrency;
    let salaryAmount = params?.value;

    let pairSymbols = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'JPY': '¥',
      'CHF': '₣',
      'AUD': 'AU$',
      'CAD': 'C$'
    }

    if (params.context.selectedCurrency == '' || params.context.selectedCurrency == 'DEFAULT' ) {
      this.renderedSalaryWithCurrency = salaryAmount == 0 ? null : this.data.salaryHistory.salaryInfos.length > 0 ?
        (this.numberService.formatBigNumberWithSpaces(salaryAmount) + " " + this.numberService.formatCurrency(salaryCurrency))
        : null;
    } else {
      this.renderedSalaryWithCurrency = salaryAmount == 0 ? null : this.data.salaryHistory.salaryInfos.length > 0 ?
        (this.numberService.formatBigNumberWithSpaces(salaryAmount) + " " + pairSymbols[params.context.selectedCurrency])
        : null;
    }

  }


  refresh(params): boolean {
    this.params = params;
    params.api.redrawRows();
    console.log("params:", params)
    console.log("selectedCurrency in cell renderer :", params.context.selectedCurrency)

    return true;
  }

}
