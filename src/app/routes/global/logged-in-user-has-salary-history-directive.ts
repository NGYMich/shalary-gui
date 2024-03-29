import {Directive, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {TokenStorageService} from "../../services/TokenStorageService";
import {UserService} from "../../services/UserService";

@Directive({
  selector: '[loggedInUserHasSalaryHistory]'
})
export class LoggedInUserHasSalaryHistoryDirective implements OnInit {

  constructor(private tokenStorageService: TokenStorageService,
              private userService: UserService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    if (this.tokenStorageService.getHasSalaryHistory()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
