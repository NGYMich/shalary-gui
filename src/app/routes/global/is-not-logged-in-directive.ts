import {Directive, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {TokenStorageService} from "../../services/TokenStorageService";

@Directive({
  selector: '[isNotLoggedIn]'
})
export class IsNotLoggedInDirective implements OnInit {

  constructor(private tokenStorageService: TokenStorageService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    if (this.tokenStorageService.getUser() == null) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}