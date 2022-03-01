import {SalaryHistory} from "./salaryHistory";

export class User {
  id: number | null;
  validated: boolean | null;
  username: string | null;
  password: string | null;
  mail: string | null;
  mainSector: string | null;
  location: string | null;
  locationImage: string | null;
  education: string | null;
  age: number | null;
  comment: string | null;
  gender: Gender;
  salaryHistory: SalaryHistory;
}

enum Gender {
  Male, Female, Unknown
}
