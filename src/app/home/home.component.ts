import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  sectors = ['Banking & Finance', 'Economics', 'Politics', 'Energy', 'Consulting', 'Healthcare', 'Manual Working', 'Real Estate'];

  constructor() { }

  ngOnInit(): void {
  }

}
