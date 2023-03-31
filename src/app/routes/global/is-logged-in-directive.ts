import {Directive, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {TokenStorageService} from "../../services/TokenStorageService";

@Directive({
  selector: '[isLoggedIn]'
})
export class IsLoggedInDirective implements OnInit {

  constructor(private tokenStorageService: TokenStorageService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {

    console.log('Token stored user : ', this.tokenStorageService.getUser())

    if (this.tokenStorageService.getUser() != null && this.tokenStorageService.getUser() != '') {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
