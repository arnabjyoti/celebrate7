import { TestBed } from '@angular/core/testing';

import { EventsCategorywiseService } from './events-categorywise.service';

describe('EventsCategorywiseService', () => {
  let service: EventsCategorywiseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsCategorywiseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
