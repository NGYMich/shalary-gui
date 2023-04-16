import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/UserService";
import {animate, state, style, transition, trigger,} from '@angular/animations';
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {Country} from "../../model/country";
import {LocationService} from "../../services/LocationService";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  animations: [
    trigger('openClose', [
      state('in', style({transform: 'translateX(0)'})),
      transition('open => closed', [
        style({transform: 'translateX(-100%)'}),
        animate(1000)
      ]),
      transition('closed => open', [
        animate(1000, style({transform: 'translateX(100%)'}))
      ])
    ]),

    trigger('openClose2', [
      state('in', style({transform: 'translateY(0)'})),
      transition('open => closed', [
        style({transform: 'translateY(-100%)'}),
        animate('1000ms 0ms')
      ]),
      transition('closed => open', [
        animate(1000, style({transform: 'translateY(100%)'}))
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
        animate('1000ms 1000ms')
      ])
    ])
  ]
})
export class TestComponent implements OnInit {
  // sectors = ['Banking & Finance', 'Economics', 'Politics', 'Energy', 'Consulting', 'Healthcare', 'Manual Working', 'Real Estate', 'Catering'];

  introductionMessage =
    `
        Nowadays, many people do not know what their salary expectations should be, even after working for several years.
        Some underestimate their market value, and some overestimate it : it can be very difficult to get accurate
        data.
        <br><br>
        After two years of experience in the same company, let's say that you want to know what salary increase you could get by switching jobs and company.
        <br><br>
        You start to look, but you realize information given is all over the place : salary in different currencies
        and countries, you don't find people with same skills as yours, or in the same sector as you work in, and
        around you, no one wants to share their salary. Well good news, Shalary is here to save you !
    `

  introductionMessage2 =
    `
        Shalary is a website where everyone can anonymously share their salary history.
        <br><br>
        From anywhere in the world,
        you can read data about other users, their story and their progression throughout their careers, in
        various
        sectors such as Banking, Finance, IT, Sales, Trading, Healthcare, etc.
        <br>
        <br>
        You will be able to obtain interesting data thanks to the various testimonies of the users of the site.
        For
        example, you want to know the average salary of a data scientist after a master and 5 years of experience
        in
        Paris in consulting firms?
        No problem, Shalary is here for you.
    `

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  redirectToSalariesPage() {
    this.router.navigate(['/careers/graphical-view'])
  }

}


