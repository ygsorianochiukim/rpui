import { TestBed } from '@angular/core/testing';

import { TaskstepService } from './taskstep.service';

describe('TaskstepService', () => {
  let service: TaskstepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskstepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
