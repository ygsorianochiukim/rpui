import { TestBed } from '@angular/core/testing';

import { TaskrepeatService } from './taskrepeat.service';

describe('TaskrepeatService', () => {
  let service: TaskrepeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskrepeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
