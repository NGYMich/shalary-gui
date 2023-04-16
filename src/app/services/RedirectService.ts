import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class RedirectService {


  constructor(private http: HttpClient, private router: Router) {
  }


  redirectToRegisterRoute(event): void {
    this.router.navigate(['/register'])
  }

}
