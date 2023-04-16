import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareersGraphicalView } from './careers-graphical-view';

describe('SalariesAlternativeViewComponent', () => {
  let component: CareersGraphicalView;
  let fixture: ComponentFixture<CareersGraphicalView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareersGraphicalView ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareersGraphicalView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
