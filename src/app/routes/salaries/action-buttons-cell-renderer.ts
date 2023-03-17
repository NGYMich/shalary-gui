import {Component} from "@angular/core";

@Component({
  selector: 'company-cell-renderer',
  template: `<button mat-button (click)="testClick()">Test</button>
  `
})

export class ActionsButtonsCellRenderer {
  params: any;

  agInit(params: any) {
    this.params = params;

  }

  testClick() {
    console.log("hi")
  }
}
