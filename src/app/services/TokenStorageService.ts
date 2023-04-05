import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";

const TOKEN_KEY = 'SHALARY_AUTHENTICATION_TOKEN';
const USER_KEY = 'SHALARY_AUTHENTICATED_USER';
const HAS_SALARY_HISTORY_KEY = 'SHALARY_HAS_SALARY_HISTORY';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private cookieService: CookieService) {
  }

  // signOut(): void {
  //   window.sessionStorage.clear();
  // }
  //
  // public saveToken(token: string): void {
  //   window.sessionStorage.removeItem(TOKEN_KEY);
  //   window.sessionStorage.setItem(TOKEN_KEY, token);
  //
  // }
  //
  // public getToken(): string {
  //   return <string>sessionStorage.getItem(TOKEN_KEY);
  // }
  //
  // public saveUser(user): void {
  //   window.sessionStorage.removeItem(USER_KEY);
  //   window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  // }
  //
  // public getUser(): any {
  //   return JSON.parse(<string>sessionStorage.getItem(USER_KEY));
  // }
  //
  // public saveHasSalaryHistory(boolean): any {
  //   window.sessionStorage.removeItem(HAS_SALARY_HISTORY_KEY);
  //   window.sessionStorage.setItem(HAS_SALARY_HISTORY_KEY, (boolean));
  // }
  //
  // public getHasSalaryHistory(): any{
  //   return JSON.parse(<string>sessionStorage.getItem(HAS_SALARY_HISTORY_KEY));
  // }

  signOut(): void {
    // window.sessionStorage.clear();
    /* for oauth2 cookie */
    this.cookieService.delete(TOKEN_KEY, "/")
    this.cookieService.delete(USER_KEY, "/")
    this.cookieService.delete(HAS_SALARY_HISTORY_KEY, "/")

    /* for normal cookie */
    this.cookieService.delete(TOKEN_KEY)
    this.cookieService.delete(USER_KEY)
    this.cookieService.delete(HAS_SALARY_HISTORY_KEY) //deleteAll() dont work for some reason


    this.cookieService.deleteAll()

  }

  public saveToken(token: string): void {
    this.cookieService.delete(TOKEN_KEY, token)
    this.cookieService.set(TOKEN_KEY, token)
  }

  public getToken(): string {
    return this.cookieService.get(TOKEN_KEY);
  }

  public saveUser(user): void {
    this.cookieService.delete(USER_KEY);
    this.cookieService.set(USER_KEY, JSON.stringify(user),);
  }

  public getUser(): any {
    return this.cookieService.get(USER_KEY);
  }

  public saveHasSalaryHistory(boolean): any {
    this.cookieService.delete(HAS_SALARY_HISTORY_KEY);
    this.cookieService.set(HAS_SALARY_HISTORY_KEY, (boolean));
  }

  public getHasSalaryHistory(): any {
    return this.cookieService.get(HAS_SALARY_HISTORY_KEY);
  }
}
