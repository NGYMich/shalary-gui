import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  algorithmSuggestions: string[] = [
    '------------------------------ First priority ------------------------------',
    'When user clicks on next page, call API to load next page data. Example : User sees page 1 with 50 rows, Front-end asks API to load 100 rows for 2 pages. User navigate to page 2, front-end asks API to loads additional 50 rows.',
    'Add categories / filters',
    'Add data : by location, age, min/max/means, recommendations',
    'Responsive / mobile => see homepage, save user, etc',
    'Fix back-end and see why SQL is bugged sometimes (check setSalaryInfos etc)',
    'Must add experiences in order to unlock all salaries',
    'Translation ?',
    'Compare two users',
    'Graph Legend : modify on click interaction to not show details in parenthesis, and maybe modify its position',
    'Optimize get location image'
  ];
  graphicalSuggestions: string[] = [
    '------------------------------ First priority -----------------------------',
    'Make sector writable instead of select ? Or multi select ?',
    'Make multiform? Do we do it after sign up or during ?',
    'Make sign up / login forms with material ui',
    'Get salary currency in function of country ?',
    'Hide .properties passwords',
    'Fix share your experience button',
    'Inspire from CMC log in / register system',
    'Make "tips" button for ag grid',
    'Make login usable with username OR email',
    'Add forgot password',
    '------------------------------ Second priority ----------------------------',
    'Add journal info with every event in the day + purge last week',
    'Responsive : add headers in function of screen size?',
    "Add more validators for text size / max length / max number of experiences etc",
    'Make search by country on the right of Home button?',
    "Fix put on red wrong validators",
    'Fix homepage',
    'Set max length / line break before displaying [...] in ag grid',
    'Add animations',
    'Add banner',
    'Mouka suggestion : make one view and collapse with a "hide button"',
    'Sovi suggestion : thumbs up / thumbs down for trust indicator',
  ];

  otherSuggestions: string[] = [
    'Host back-end / database on AWS',
    'Host front-end on Netlify / Fly.io',
    'Buy domain name .net / .io / .fr / .com',
    'Check tailwindcss',
    'Check Build in Public',
    'Think about SEO/Marketing/Deployment/Resources/Security',
    'SEO : Check competitors / what links are the most used',
    'SEO : https://www.youtube.com/watch?v=fOGF1Sq499g&ab_channel=NeilPatel check at 2:16 maybe idea for homepage',
    'SEO : Use Google Analytics & Google Search Console',
    'Reset SQL sequence : ALTER SEQUENCE user_id_seq RESTART WITH 193',
    '------------------------------------------ SOCIAL MEDIA -----------------------------------------',
    'Create Acc on twitter, follow good companies / celebrities and post the site',
  ]


  constructor() {
  }

  ngOnInit(): void {
  }

}
