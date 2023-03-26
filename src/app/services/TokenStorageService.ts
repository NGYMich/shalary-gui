import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const HAS_SALARY_HISTORY_KEY = 'has-salary-history';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return <string>sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(<string>sessionStorage.getItem(USER_KEY));
  }

  public saveHasSalaryHistory(boolean): any {
    window.sessionStorage.removeItem(HAS_SALARY_HISTORY_KEY);
    window.sessionStorage.setItem(HAS_SALARY_HISTORY_KEY, (boolean));
  }

  public getHasSalaryHistory(): any{
    return JSON.parse(<string>sessionStorage.getItem(HAS_SALARY_HISTORY_KEY));
  }
}
