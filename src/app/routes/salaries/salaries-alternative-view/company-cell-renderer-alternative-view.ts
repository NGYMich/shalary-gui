import {Component} from "@angular/core";

@Component({
  selector: 'company-cell-renderer',
  template: `
    <div style="line-height: 25px;">
      {{this.companyName}} <span *ngIf="this.sector != null"><i> ({{this.sector}})</i></span>
    </div>

  `
})

export class CompanyCellRendererAlternativeView {
  params: any;
  companyName: any;
  sector: any;
  agInit(params: any) {
    this.params = params;
    let salaryInfos = params.data.salaryHistory.salaryInfos;
    if (salaryInfos != null) {
      let latestCompany = salaryInfos[salaryInfos.length - 1].company;
      if (salaryInfos.length > 0 && latestCompany != null) {
        this.companyName = latestCompany.name
        this.sector = latestCompany.sector
      }
    }
  }
}
