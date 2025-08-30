import { TestBed } from '@angular/core/testing';

import { TasklogsService } from './tasklogs.service';

describe('TasklogsService', () => {
  let service: TasklogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasklogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
