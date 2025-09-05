import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskpositionPage } from './taskposition.page';

describe('TaskpositionPage', () => {
  let component: TaskpositionPage;
  let fixture: ComponentFixture<TaskpositionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskpositionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
