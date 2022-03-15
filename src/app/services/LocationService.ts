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
    console.log('called', this.rootURL + '/locations/countriesWithFlags');
    return this.http.get(this.rootURL + '/locations/countriesWithFlags');
  }

  getCountriesWithFlagsAndStates(): any {
    console.log('called', this.rootURL + '/locations/countriesWithFlagsAndStates');
    return this.http.get(this.rootURL + '/locations/countriesWithFlagsAndStates');
  }


}
