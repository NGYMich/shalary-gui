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
}

export class Company {
  id: number;
  name: string = "";
  sector: string;
  size: string;
}
