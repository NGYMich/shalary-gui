import {Component, OnInit} from '@angular/core';

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
    'Responsive / mobile => see homepage, save user, etc',
    'Fix back-end and see why SQL is bugged sometimes (check setSalaryInfos etc)',
    'Must add experiences in order to unlock all salaries',
    'User authentification ?',
    'Think about limiting to only one or few countries ? FR/UK/USA/GER ? Translation ?',
    'Compare two users',
    'Graph Legend : modify on click interaction to not show details in parenthesis, and maybe modify its position',
    'Encrypt passwords',
    'Optimize get location image'
  ];
  graphicalSuggestions: string[] = [
    'Remove displayname since username already exists',
    'Update UserDTO',
    'Replace User experiences with "My Career"',
    'Workflow : I signup, I login, I update my career, its reflected on careers and salaries.' ,
    '',
    '',
    'Log out button',
    'Hide .properties passwords',
    '--------------------------------------------------------------',
    'Add journal info with every event in the day + purge last week',
    'Responsive : add headers in function of screen size?',
    "Add more validators for text size / max length / max number of experiences etc",
    "Fix put on red wrong validators",
    'Fix homepage',
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
    'Reset SQL sequence : ALTER SEQUENCE user_id_seq RESTART WITH 193'
  ]


  constructor() {
  }

  ngOnInit(): void {
  }

}
