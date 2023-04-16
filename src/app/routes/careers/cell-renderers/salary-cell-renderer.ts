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
    let pairSymbols = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'JPY': '¥',
      'CHF': '₣',
      'AUD': 'AU$',
      'CAD': 'C$'
    }
    this.params = params;
    this.data = params?.data
    let salaryAmount = params.value;
    let salaryCurrency = params.context.isSalaryComponent ? this.data.currency : this.data.salaryHistory.salaryCurrency;
    if (params.context.isSalaryComponent) {
      if (params.context.selectedCurrency == '' || params.context.selectedCurrency == 'DEFAULT' ) {
        this.renderedSalaryWithCurrency = (this.numberService.formatBigNumberWithSpaces(salaryAmount) + " " + this.numberService.formatCurrency(salaryCurrency))
      } else {
        this.renderedSalaryWithCurrency = (this.numberService.formatBigNumberWithSpaces(salaryAmount) + " " + pairSymbols[params.context.selectedCurrency])
      }
    } else {
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



  }


  refresh(params): boolean {
    this.params = params;
    params.api.redrawRows();
    // console.log("params:", params)
    // console.log("selectedCurrency in cell renderer :", params.context.selectedCurrency)

    return true;
  }

}
