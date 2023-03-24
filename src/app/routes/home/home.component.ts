import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  sectors = ['Banking & Finance', 'Economics', 'Politics', 'Energy', 'Consulting', 'Healthcare', 'Manual Working', 'Real Estate', 'Catering'];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectToSalariesPage() {
    this.router.navigate(['/salaries'])
  }

}
