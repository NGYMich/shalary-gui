import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  rootURL = 'http://localhost:2111/api';

  constructor(private http: HttpClient) {
  }

  getCountriesWithFlags(): any {
    return this.http.get(this.rootURL + '/locations');
  }


}
