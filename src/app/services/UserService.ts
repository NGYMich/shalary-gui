import {Injectable} from '@angular/core';
import {User} from "../model/user";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AppConstants} from "../routes/global/common-variables";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // rootURL = 'http://localhost:2111/api';
  rootURL = environment.baseUrl

  // tslint:disable-next-line:variable-name
  private _deleteOperationSuccessfulEvent$: Subject<boolean> = new Subject();

  constructor(private http: HttpClient) {
  }

  getUsers(): any {
    console.log('called', this.rootURL + '/users');
    return this.http.get(this.rootURL + '/users');
  }


  getUsersWithSalaryHistory(): any {
    console.log('called', this.rootURL + '/usersWithSalaryHistory');
    return this.http.get(this.rootURL + '/usersWithSalaryHistory');
  }

  getUserById(id) {
    console.log('called', this.rootURL + '/users/' + id);
    return this.http.get(this.rootURL + '/users/' + id);
  }

  getMostPopularCountriesFromUsers(): any {
    console.log('called', this.rootURL + '/mostPopularCountries');
    return this.http.get(this.rootURL + '/mostPopularCountries');
  }

  addUser(user: User): any {
    const body = JSON.stringify(user);
    const headers = {'content-type': 'application/json'};
    return this.http.post<User>(this.rootURL + '/user', body, {'headers': headers})
  }

  retrieveUserWithUsernameAndPassword(username: string, password: string): any {
    const body = JSON.stringify({username: username, password: password});
    const headers = {'content-type': 'application/json'};
    return this.http.post<User>(this.rootURL + '/retrieveUserWithPassword', body, {'headers': headers})
  }

  modifyUser(user: User): any {
    console.log('modifying user', user.username + ' with id', user.id)
    const body = JSON.stringify(user);
    const headers = {'content-type': 'application/json'};
    return this.http.patch<User>(this.rootURL + '/user', body, {'headers': headers})
  }

  deleteUser(username: string, userId: number,): any {
    console.log('deleting user', username + ' with id', userId)
    return this.http.delete(this.rootURL + '/user/' + userId).subscribe(data => {
      console.log(data);
      this._deleteOperationSuccessfulEvent$.next(true);
    });
  }

  loggedUserHasSalaryHistory(id): Observable<any> {
    var subject = new Subject<boolean>();

    this.getUserById(id).subscribe(user => {
      subject.next(user['salaryHistory'] != null)
        return

      }
    )
    return subject.asObservable()
  }
  // ALL AUTHENTICATION ENDPOINTS
  //
  getPublicContent(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'admin', { responseType: 'text' });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'user/me', httpOptions);
  }
}
