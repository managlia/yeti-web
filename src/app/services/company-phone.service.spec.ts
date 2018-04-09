import { TestBed, inject } from '@angular/core/testing';

import { CompanyPhoneService } from './company-phone.service';

describe('CompanyPhoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyPhoneService]
    });
  });

  it('should be created', inject([CompanyPhoneService], (service: CompanyPhoneService) => {
    expect(service).toBeTruthy();
  }));
});
