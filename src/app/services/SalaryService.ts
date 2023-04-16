import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GridOptions} from "ag-grid-community";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  // rootURL = 'http://localhost:2111/api';
  rootURL = environment.baseUrl + 'api'

  // tslint:disable-next-line:variable-name
  private _deleteOperationSuccessfulEvent$: Subject<boolean> = new Subject();

  constructor(private http: HttpClient) {
  }

  getSalaries(): any {
    console.log('called', this.rootURL + '/salaries/salaries');
    return this.http.get(this.rootURL + '/salaries/salaries');
  }

  filterByCountry(name: string, isFilteredByPopularCountry, gridApi) {
    if (isFilteredByPopularCountry && gridApi.getFilterInstance('location').appliedModel.filter == name) {
      gridApi.destroyFilter('location');
      isFilteredByPopularCountry = false;
    } else {
      gridApi.getFilterInstance('location').setModel({type: "equals", filter: name});
      isFilteredByPopularCountry = true;
    }
    gridApi!.onFilterChanged();
  }




  applyRateToSalary(params, salary: number | null, selectedCurrency, forexRates, baseCurrency: string | null = null,) {

    let fromCurrency = baseCurrency != null ? baseCurrency.substring(0 ,3) : params.data?.salaryHistory?.salaryCurrency?.substring(0, 3);

    if (fromCurrency != selectedCurrency && selectedCurrency != 'DEFAULT') {
      let pair = fromCurrency + "_" + selectedCurrency
      let rate = (pair in forexRates) ? forexRates[pair] : 1
      return salary != null ? (Math.ceil(salary * rate / 100) * 100).toFixed(0) : salary;
    } else {
      return salary
    }
  }


  onFilterTextBoxChanged(gridOptions) {
    gridOptions.api!.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }
}
