import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserInfosComponent } from './add-user-infos.component';

describe('AddUserInfosComponent', () => {
  let component: AddUserInfosComponent;
  let fixture: ComponentFixture<AddUserInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserInfosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
