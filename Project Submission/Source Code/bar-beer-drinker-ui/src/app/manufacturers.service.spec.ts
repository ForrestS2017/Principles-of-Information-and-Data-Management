import { TestBed, inject } from '@angular/core/testing';

import { ManufacturersService } from './manufacturers.service';

describe('ManufacturersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManufacturersService]
    });
  });

  it('should be created', inject([ManufacturersService], (service: ManufacturersService) => {
    expect(service).toBeTruthy();
  }));
});
