import {Component, OnInit} from '@angular/core';
import {Article} from "../../model/article";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  articles: Article[] = [
    new Article("What's the best way to get a big raise ?", "Click this article or you will regret it", ""),
    new Article("The history of Shalary", "Nothing much tbh boring stuff", ""),
    new Article("Do you like Shiba Inu ?", "Hint : Yes you do.", ""),


  ]
  articlesSubHeaders = ['Click this article or you will regret it.']

  constructor() {
  }

  ngOnInit(): void {
  }

}
