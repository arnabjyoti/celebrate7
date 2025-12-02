import { TestBed } from '@angular/core/testing';

import { ClientQueriesService } from './client-queries.service';

describe('ClientQueriesService', () => {
  let service: ClientQueriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientQueriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
