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
        You need access to salaries. It's a taboo around you. No one talks about their current or past salaries. Well, here, everyone can view eachother's careers and everything is anonymous. What else to ask ?
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

  introductionMessage4 =
    `
        There also will be articles about different topics : negociations, formations, learning, data analytics, economics, and much more. Beware !
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
