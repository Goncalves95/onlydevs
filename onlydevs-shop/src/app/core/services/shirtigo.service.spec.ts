import { TestBed } from '@angular/core/testing';

import { ShirtigoService } from './shirtigo.service';

describe('ShirtigoService', () => {
  let service: ShirtigoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShirtigoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
