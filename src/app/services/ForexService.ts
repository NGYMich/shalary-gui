import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForexService {
  rootURL = 'http://localhost:2111/api';

  constructor(private http: HttpClient) {
  }

  getTopForexRates(): any {
    console.log('called', this.rootURL + '/forex/topForexes');
    return this.http.get(this.rootURL + '/forex/topForexes');
  }
}
