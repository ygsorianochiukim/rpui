import { TestBed } from '@angular/core/testing';

import { TasknoteService } from './tasknote.service';

describe('TasknoteService', () => {
  let service: TasknoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasknoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
