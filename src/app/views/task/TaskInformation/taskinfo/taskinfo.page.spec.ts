import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskinfoPage } from './taskinfo.page';

describe('TaskinfoPage', () => {
  let component: TaskinfoPage;
  let fixture: ComponentFixture<TaskinfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
