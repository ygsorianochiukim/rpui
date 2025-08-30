import { TestBed } from '@angular/core/testing';

import { AccessLineService } from './access-line.service';

describe('AccessLineService', () => {
  let service: AccessLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
