import {SalaryHistory} from "./salaryHistory";

export class User {
  id: number | null;
  email: string | null;
  password: string | null;
  username: string | null;

  mainSector: string | null;
  location: string | null;
  locationImage: string | null;
  city: string | null;
  education: string | null;
  age: number | null;
  gender: string | null;
  comment: string | null;
  salaryHistory: SalaryHistory;

  createdDate: string | null;
  modifiedDate: string | null;
  provider: string | null;
  thumbsUp: number | null;
  thumbsDown: number | null;

  validated: boolean | null = true;

}

