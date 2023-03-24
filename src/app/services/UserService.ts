import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../model/user";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

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
}
