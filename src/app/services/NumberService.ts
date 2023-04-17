import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberService {
  formatBigNumberWithSpaces(salary: number, currency: any = null): string {

    let numberWithSpaces: string = salary.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    if (currency != null) {
      numberWithSpaces += " " + currency
    }
    return numberWithSpaces
  }

  formatCurrency(currency: string) {
    let regExp = /\(([^)]+)\)/;
    if (currency != null)
      return (currency.includes("(") && currency.includes(")")) ? regExp.exec(currency)![1] : currency;
    return ""
  }

  nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
}
