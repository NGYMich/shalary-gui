import {Directive, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

@Directive({
  selector: '[isMobile]'
})
export class IsMobileDirective implements OnInit {

  constructor(private deviceService: DeviceDetectorService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private breakpointObserver: BreakpointObserver,
  ) {


  }

  ngOnInit() {
    this.breakpointObserver.observe([
      "(max-width: 970px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches || this.deviceService.isMobile()) {
        console.log('width < 970px')
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });

  }
}
