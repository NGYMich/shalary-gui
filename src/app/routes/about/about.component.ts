import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  algorithmSuggestions: string[] = [
    'For save user => do it in another page or keep it as it is ?',
    'Add categories / filters',
    'Add data : by location, age, min/max/means, recommendations',
    'Telephone usage ?',
    'Must add experiences in order to unlock all salaries',
    'User authentification ?',
    'Think about limiting to only one or few countries ? FR/UK/USA/GER ? Translation ?',
  ];
  graphicalSuggestions: string[] = [
    'Fix homepage',
    'Add animations',
    'Add banner'
  ];

  otherSuggestions: string[] = [
    'Check fly.io',
    'Check tailwindcss',
    'Check Build in Public',
    'Think about SEO/Marketing/Deployment/Resources/Security'
  ]


  constructor() { }

  ngOnInit(): void {
  }

}
