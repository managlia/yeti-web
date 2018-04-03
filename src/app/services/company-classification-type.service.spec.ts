import { TestBed, inject } from '@angular/core/testing';

import { CompanyClassificationTypeService } from './company-classification-type.service';

describe('CompanyClassificationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyClassificationTypeService]
    });
  });

  it('should be created', inject([CompanyClassificationTypeService], (service: CompanyClassificationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
