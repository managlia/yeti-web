import { TestBed, inject } from '@angular/core/testing';

import { ContactUrlService } from './contact-url.service';

describe('ContactUrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactUrlService]
    });
  });

  it('should be created', inject([ContactUrlService], (service: ContactUrlService) => {
    expect(service).toBeTruthy();
  }));
});
