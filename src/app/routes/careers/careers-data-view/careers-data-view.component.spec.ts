import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareersDataViewComponent } from './careers-data-view.component';

describe('SalariesComponent', () => {
  let component: CareersDataViewComponent;
  let fixture: ComponentFixture<CareersDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareersDataViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareersDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
