import {Component} from "@angular/core";

@Component({
  selector: 'location-cell-renderer',
  template: `
    <img width="28" height="18" [src]="countryImageLink | safe:'resourceUrl'" *ngIf="countryImageLink" onerror="this.onerror=null; this.remove();">
    {{this.params.value}}<i>{{renderCity()}}</i>
  `
})

export class LocationCellRenderer {
  params: any;
  countryImageLink;

  agInit(params: any) {
    this.params = params;
    this.countryImageLink = this.params.data.locationImage;
  }

  renderCity() {
    if (this.params.data.city != null) {
      return " (" + this.params.data.city + ")"
    }
    return ""
  }
}
