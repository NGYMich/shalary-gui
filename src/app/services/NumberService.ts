import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NumberService {


  formatBigNumberWithSpaces(salary: number) {
      return salary.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
  }
}
