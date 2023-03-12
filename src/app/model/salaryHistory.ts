import {SalaryInfo} from "./salaryInfo";

export class SalaryHistory {
  id: number | null;
  salaryCurrency: string;
  totalYearsOfExperience: number;
  salaryInfos: SalaryInfo[];
}
