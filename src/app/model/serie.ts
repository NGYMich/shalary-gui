export class Serie {
  name: string;
  value: number;
  companyName: string;
  companySector: string;
  salaryCurrency: string;
  jobName: string;


  constructor(name: string, value: number, companyName: string, salaryCurrency: string, jobName: string, companySector: string) {
    this.name = name;
    this.value = value;
    this.companyName = companyName;
    this.companySector = companySector;
    this.salaryCurrency = salaryCurrency;
    this.jobName = jobName;
  }
}
