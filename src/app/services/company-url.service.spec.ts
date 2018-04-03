import { TestBed, inject } from '@angular/core/testing';

import { CompanyUrlService } from './company-url.service';

describe('CompanyUrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyUrlService]
    });
  });

  it('should be created', inject([CompanyUrlService], (service: CompanyUrlService) => {
    expect(service).toBeTruthy();
  }));
});
