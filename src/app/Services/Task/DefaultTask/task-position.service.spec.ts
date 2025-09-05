import { TestBed } from '@angular/core/testing';

import { TaskPositionService } from './task-position.service';

describe('TaskPositionService', () => {
  let service: TaskPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
