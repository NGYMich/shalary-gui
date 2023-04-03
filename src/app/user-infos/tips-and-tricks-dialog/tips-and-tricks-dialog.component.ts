import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NumberService} from "../../services/NumberService";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-tips-and-tricks-dialog',
  templateUrl: './tips-and-tricks-dialog.component.html',
  styleUrls: ['./tips-and-tricks-dialog.component.css']
})
export class TipsAndTricksDialogComponent implements OnInit {

  isUserInfoDivOpen: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public numberService: NumberService, private deviceService: DeviceDetectorService) {
    this.isUserInfoDivOpen = this.data.isUserInfoDivOpen
  }

  ngOnInit(): void {
  }

}
