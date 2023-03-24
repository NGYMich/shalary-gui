import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../model/user";

@Component({
  selector: 'app-global-user-infos',
  templateUrl: './global-user-infos.component.html',
  styleUrls: ['./global-user-infos.component.css']
})
export class GlobalUserInfosComponent implements OnInit {
  @Input() isEditUserPage: boolean = true;
  @Input() userToModify: User | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
