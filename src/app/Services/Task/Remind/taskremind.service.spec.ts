import { TestBed } from '@angular/core/testing';

import { TaskremindService } from './taskremind.service';

describe('TaskremindService', () => {
  let service: TaskremindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskremindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
