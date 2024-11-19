import { TestBed } from '@angular/core/testing';

import { TherapyplansService } from './therapyplans.service';

describe('TherapyplansService', () => {
  let service: TherapyplansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TherapyplansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
