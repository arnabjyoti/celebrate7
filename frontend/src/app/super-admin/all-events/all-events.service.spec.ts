import { TestBed } from '@angular/core/testing';

import { AllEventsService } from './all-events.service';

describe('AllEventsService', () => {
  let service: AllEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
