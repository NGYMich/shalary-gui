import {Component} from "@angular/core";

@Component({
  selector: 'job-cell-renderer',
  template: `
      <div>
        <span style="font-weight: bold; margin-bottom: 100px;">
          <img [src]="params.data.locationImage | safe:'resourceUrl'" height="18" width="28"
               style="border-width: 1px; border-style: solid; margin-right: 3px;">
            {{this.jobName}} ({{this.params.data.salaryHistory.totalYearsOfExperience}}
            {{this.params.data.salaryHistory.totalYearsOfExperience <= 1 ? "year" : "years"}})
        </span>

          {{this.companyName != null ? "-" : ""}} {{this.companyName}}
          <span *ngIf="this.sector != null" style="font-style: italic">
        ({{this.sector}})
      </span>
      </div>

  `
})

export class JobCellRenderer {
  params: any;
  companyName: any;
  sector: any;
  jobName: any;


  agInit(params: any) {
    this.params = params;
    console.log(params.data)
    let salaryInfos = params.data.salaryHistory.salaryInfos;
    if (salaryInfos?.length > 0) {
      let latestCompany = salaryInfos[salaryInfos.length - 1].company;
      let latestJobName = salaryInfos[salaryInfos.length - 1].jobName;
      if (salaryInfos.length > 0) {
        if (latestCompany != null) {
          this.companyName = latestCompany.name
          this.sector = latestCompany.sector
        }
        if (latestJobName != null) {
          this.jobName = latestJobName
        }
      }
    }
  }
}
