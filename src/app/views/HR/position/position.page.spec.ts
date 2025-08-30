import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PositionPage } from './position.page';

describe('PositionPage', () => {
  let component: PositionPage;
  let fixture: ComponentFixture<PositionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
