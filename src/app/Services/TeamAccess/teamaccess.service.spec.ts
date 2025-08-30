import { TestBed } from '@angular/core/testing';

import { TeamaccessService } from './teamaccess.service';

describe('TeamaccessService', () => {
  let service: TeamaccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamaccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
