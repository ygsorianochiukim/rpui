import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewtaskPage } from './newtask.page';

describe('NewtaskPage', () => {
  let component: NewtaskPage;
  let fixture: ComponentFixture<NewtaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewtaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
