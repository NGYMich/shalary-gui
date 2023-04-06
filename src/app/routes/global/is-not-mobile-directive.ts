import {Directive, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

@Directive({
  selector: '[isNotMobile]'
})
export class IsNotMobileDirective implements OnInit {

  constructor(private deviceService: DeviceDetectorService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private breakpointObserver: BreakpointObserver,
  ) {
  }

  ngOnInit() {
    this.breakpointObserver.observe([
      "(max-width: 768px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches || this.deviceService.isMobile()) {
        this.viewContainer.clear();
        console.log('width < 768px')
      } else {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
