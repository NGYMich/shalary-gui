import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsAndTricksDialogComponent } from './tips-and-tricks-dialog.component';

describe('TipsAndTricksDialogComponent', () => {
  let component: TipsAndTricksDialogComponent;
  let fixture: ComponentFixture<TipsAndTricksDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipsAndTricksDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsAndTricksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
