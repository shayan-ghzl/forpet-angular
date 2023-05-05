import { TestBed } from '@angular/core/testing';

import { FakeApiService } from './fake-api.service';

describe('FakeApiService', () => {
  let service: FakeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FakeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
