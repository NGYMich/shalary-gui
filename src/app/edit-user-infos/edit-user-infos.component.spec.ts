import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserInfosComponent } from './edit-user-infos.component';

describe('EditUserInfosComponent', () => {
  let component: EditUserInfosComponent;
  let fixture: ComponentFixture<EditUserInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserInfosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
