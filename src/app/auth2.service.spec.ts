import { TestBed } from '@angular/core/testing';

import { Auth2Service } from './auth2.service';

describe('Auth2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Auth2Service = TestBed.get(Auth2Service);
    expect(service).toBeTruthy();
  });
});
