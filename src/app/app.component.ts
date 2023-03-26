import {Component} from '@angular/core';
import * as packageInfo from '../../package.json';
import {TokenStorageService} from "./services/TokenStorageService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shalary-gui';
  shalaryGuiVersion = packageInfo
  temporaryDisabled = false;
  loggedUser: any = null

  constructor(private tokenStorageService: TokenStorageService) {
  }

  ngOnInit() {
    this.loggedUser = this.tokenStorageService.getUser()
    console.log(this.loggedUser)
  }



}
