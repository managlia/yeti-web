import { TestBed, inject } from '@angular/core/testing';

import { CompanyAddressClassificationTypeService } from './company-address-classification-type.service';

describe('CompanyAddressClassificationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyAddressClassificationTypeService]
    });
  });

  it('should be created', inject([CompanyAddressClassificationTypeService], (service: CompanyAddressClassificationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
