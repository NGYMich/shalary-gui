import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../../services/UserService";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import {Router} from "@angular/router";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  animations: [
    trigger('openClose', [
      state('in', style({transform: 'translateX(0)'})),
      transition('open => closed', [
        style({transform: 'translateX(-100%)'}),
        animate(1500)
      ]),
      transition('closed => open', [
        animate(1500, style({transform: 'translateX(100%)'}))
      ])
    ]),

    trigger('openClose2', [
      state('in', style({transform: 'translateY(0)'})),
      transition('open => closed', [
        style({transform: 'translateY(-100%)'}),
        animate(1500)
      ]),
      transition('closed => open', [
        animate(1500, style({transform: 'translateY(100%)'}))
      ])
    ]),

    trigger('apparition', [
      state('open', style({
        opacity: '0'
      })),
      state('closed', style({
        opacity: '1'
      })),
      transition('open => closed', [
        animate('1s')
      ])
    ])
  ]
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
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  constructor(private userService: UserService, private router: Router) {
    setTimeout(() => {
      this.toggle()
    }, 0);
  }

  ngOnInit(): void {

  }

  navigateToSalaries() {
    this.router.navigate(['/salaries/view1'])
  }

  navigateToDataAnalytics() {
    this.router.navigate(['/data'])
  }
}


