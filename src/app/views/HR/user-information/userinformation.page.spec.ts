import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserinformationPage } from './userinformation.page';

describe('UserinformationPage', () => {
  let component: UserinformationPage;
  let fixture: ComponentFixture<UserinformationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
