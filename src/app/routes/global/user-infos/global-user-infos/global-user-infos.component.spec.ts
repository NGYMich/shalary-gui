import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalUserInfosComponent } from './global-user-infos.component';

describe('GlobalUserInfosComponent', () => {
  let component: GlobalUserInfosComponent;
  let fixture: ComponentFixture<GlobalUserInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalUserInfosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalUserInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
