import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationsFormComponent } from './user-informations-form-component';

describe('UserInformationsFormComponent', () => {
  let component: UserInformationsFormComponent;
  let fixture: ComponentFixture<UserInformationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInformationsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
