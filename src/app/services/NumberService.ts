import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberService {
  formatBigNumberWithSpaces(salary: number) {
    return salary.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
  }

  formatCurrency(currency: string) {
    let regExp = /\(([^)]+)\)/;
    return (currency.includes("(") && currency.includes(")")) ? regExp.exec(currency)![1] : currency;
  }
}
