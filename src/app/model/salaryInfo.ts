export class SalaryInfo {
  id: number;
  yearsOfExperience: number;
  jobLevel: string;
  jobName: string;
  baseSalary: number;
  stockSalary: number;
  bonusSalary: number;
  totalSalary: number;
  netTotalSalary: number;
  company: Company;

  contractType: string;

  constructor(yearsOfExperience: number, jobName: string, baseSalary: number, stockSalary: number, bonusSalary: number, totalSalary: number, company: Company, contractType: string) {
    this.yearsOfExperience = yearsOfExperience;
    this.jobName = jobName;
    this.baseSalary = baseSalary;
    this.stockSalary = stockSalary;
    this.bonusSalary = bonusSalary;
    this.totalSalary = totalSalary;
    this.company = company;
    this.contractType = contractType;
  }


}

export class Company {
  id: number;
  name: string = "";
  sector: string;
  size: string;
}
