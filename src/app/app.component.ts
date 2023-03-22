import { Component } from '@angular/core';
import * as packageInfo from '../../package.json';
import {DeviceDetectorService} from "ngx-device-detector";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shalary-gui';
  shalaryGuiVersion = packageInfo
  temporaryDisabled = false;
}
