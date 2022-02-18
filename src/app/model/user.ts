import {SalaryHistory} from "./salaryHistory";

export class User {
  id: number;
  validated: boolean;
  username: string;
  password: string;
  mail: string;
  mainSector: string;
  location: string;
  education: string;
  age: number;
  gender: Gender;
  salaryHistory: SalaryHistory;
}

enum Gender {
  Male, Female, Unknown
}
