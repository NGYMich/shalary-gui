import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
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
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectToSalariesPage() {
    this.router.navigate(['/salaries'])
  }

}
