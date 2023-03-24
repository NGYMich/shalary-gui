import {FormGroup} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public addUser_UserInformationsForm: FormGroup;
  public addUser_SalaryInfosForm: FormGroup;
}
