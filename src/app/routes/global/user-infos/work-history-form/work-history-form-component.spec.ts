import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHistoryFormComponent } from './work-history-form-component';

describe('WorkHistoryFormComponent', () => {
  let component: WorkHistoryFormComponent;
  let fixture: ComponentFixture<WorkHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkHistoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
