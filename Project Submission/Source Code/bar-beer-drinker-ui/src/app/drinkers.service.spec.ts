import { TestBed, inject } from '@angular/core/testing';

import { DrinkersService } from './drinkers.service';

describe('DrinkersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrinkersService]
    });
  });

  it('should be created', inject([DrinkersService], (service: DrinkersService) => {
    expect(service).toBeTruthy();
  }));
});
