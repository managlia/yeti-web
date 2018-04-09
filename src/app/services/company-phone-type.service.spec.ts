import { TestBed, inject } from '@angular/core/testing';

import { CompanyPhoneTypeService } from './company-phone-type.service';

describe('CompanyPhoneTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyPhoneTypeService]
    });
  });

  it('should be created', inject([CompanyPhoneTypeService], (service: CompanyPhoneTypeService) => {
    expect(service).toBeTruthy();
  }));
});
