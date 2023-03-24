import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInputErrorDialogComponent } from './user-input-error-dialog.component';

describe('UserInputErrorDialogComponent', () => {
  let component: UserInputErrorDialogComponent;
  let fixture: ComponentFixture<UserInputErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInputErrorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInputErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
