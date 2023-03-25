import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariesAlternativeViewComponent } from './salaries-alternative-view.component';

describe('SalariesAlternativeViewComponent', () => {
  let component: SalariesAlternativeViewComponent;
  let fixture: ComponentFixture<SalariesAlternativeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalariesAlternativeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariesAlternativeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
