import {SalaryHistory} from "./salaryHistory";

export class SalaryInfo {
  yearsOfExperience: number;
  jobLevel: string;
  jobName: string;
  baseSalary: number;
  stockSalary: number;
  bonusSalary: number;
  totalSalary: number;
  netTotalSalary: number;

  constructor(yearsOfExperience: number, jobLevel: string, jobName: string, baseSalary: number, stockSalary: number, bonusSalary: number, totalSalary: number, netTotalSalary: number) {
    this.yearsOfExperience = yearsOfExperience;
    this.jobLevel = jobLevel;
    this.jobName = jobName;
    this.baseSalary = baseSalary;
    this.stockSalary = stockSalary;
    this.bonusSalary = bonusSalary;
    this.totalSalary = totalSalary;
    this.netTotalSalary = netTotalSalary;
  }

}
