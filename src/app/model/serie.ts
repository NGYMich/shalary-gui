export class Serie {
  name: string;
  value: number;
  companyName: string;
  salaryCurrency: string;
  jobName: string;

  constructor(name: string, value: number, companyName: string, salaryCurrency: string, jobName: string,) {
    this.name = name;
    this.value = value;
    this.companyName = companyName;
    this.salaryCurrency = salaryCurrency;
    this.jobName = jobName;
  }
}
