import { TestBed } from '@angular/core/testing';

import { LandingScreenService } from './landing-screen.service';

describe('LandingScreenService', () => {
  let service: LandingScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
