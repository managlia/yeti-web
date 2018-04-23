import { TestBed, inject } from '@angular/core/testing';

import { SmallChatterService } from './small-chatter.service';

describe('SmallChatterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmallChatterService]
    });
  });

  it('should be created', inject([SmallChatterService], (service: SmallChatterService) => {
    expect(service).toBeTruthy();
  }));
});
