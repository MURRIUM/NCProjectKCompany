import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountPopupComponent } from './create-account-popup.component';

describe('CreateAccountPopupComponent', () => {
  let component: CreateAccountPopupComponent;
  let fixture: ComponentFixture<CreateAccountPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
