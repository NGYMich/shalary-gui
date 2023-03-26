import {Directive, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {TokenStorageService} from "../../services/TokenStorageService";
import {UserService} from "../../services/UserService";

@Directive({
  selector: '[loggedInUserHasNoSalaryHistory]'
})
export class LoggedInUserHasNoSalaryHistoryDirective implements OnInit {

  constructor(private tokenStorageService: TokenStorageService,
              private userService: UserService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    if (this.tokenStorageService.getHasSalaryHistory() != null) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
