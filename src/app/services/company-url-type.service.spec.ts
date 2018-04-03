import { TestBed, inject } from '@angular/core/testing';

import { CompanyUrlTypeService } from './company-url-type.service';

describe('CompanyUrlTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyUrlTypeService]
    });
  });

  it('should be created', inject([CompanyUrlTypeService], (service: CompanyUrlTypeService) => {
    expect(service).toBeTruthy();
  }));
});
