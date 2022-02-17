import {SalaryInfo} from "./salaryInfo";

export class SalaryHistory {
  id: number;
  salaryCurrency: string;
  totalYearsOfExperience: number;
  salaryInfos: SalaryInfo[];

  constructor(id: number, salaryCurrency: string, totalYearsOfExperience: number, salaryInfos: SalaryInfo[]) {
    this.id = id;
    this.salaryCurrency = salaryCurrency;
    this.totalYearsOfExperience = totalYearsOfExperience;
    this.salaryInfos = salaryInfos;
  }
}
