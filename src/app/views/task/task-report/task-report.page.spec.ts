import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskReportPage } from './task-report.page';

describe('TaskReportPage', () => {
  let component: TaskReportPage;
  let fixture: ComponentFixture<TaskReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
