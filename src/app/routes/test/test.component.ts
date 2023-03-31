import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../../services/UserService";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  // encapsulation: ViewEncapsulation.None,

})
export class TestComponent implements OnInit {

  introductionMessage =
    `
        People do not know what their salary expectations should be. Some underestimate their market value, and some overestimate it : it can be very difficult to get accurate
        data. Well good news, Shalary is here to save you !
    `

  introductionMessage2 =
    `
        You will be able to obtain interesting data thanks to the various testimonies of the users of the site.
        For
        example, you want to know the average salary of a data scientist after a master and 5 years of experience
        in
        Paris in consulting firms?
        No problem, Shalary is here for you.
    `

  introductionMessage3 =
    `
        You will be able to obtain interesting data thanks to the various testimonies of the users of the site.
        For
        example, you want to know the average salary of a data scientist after a master and 5 years of experience
        in
        Paris in consulting firms?
        No problem, Shalary is here for you.
    `
  content: string;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

}
