import { TestBed, inject } from '@angular/core/testing';

import { BarsService } from './bars.service';

describe('BarsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BarsService]
    });
  });

  it('should be created', inject([BarsService], (service: BarsService) => {
    expect(service).toBeTruthy();
  }));
});
