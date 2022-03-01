import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from "../model/user";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  rootURL = 'http://localhost:2111/api';

  constructor(private http: HttpClient) {
  }

  // tslint:disable-next-line:variable-name
  private _deleteOperationSuccessfulEvent$: Subject<boolean> = new Subject();

  getUsers(): any {
    console.log(this.rootURL + '/users');
    return this.http.get(this.rootURL + '/users');
  }

  // getUser(user: User): any  {
  //
  // }

  addUser(user: User): any {
    const body = JSON.stringify(user);
    const headers = {'content-type': 'application/json'};
    return this.http.post<User>(this.rootURL + '/user', body, {'headers': headers}).subscribe(
      data => console.log('added user', data),
      error => console.log('oops', error)
    );
  }

  deleteUser(user: User): any {
    return this.http.delete(this.rootURL + '/user/' + user.id).subscribe(data => {
      console.log(data);
      this._deleteOperationSuccessfulEvent$.next(true);
    });
  }
}
