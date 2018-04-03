import { TestBed, inject } from '@angular/core/testing';

import { CompanyOrContactService } from './company-or-contact.service';

describe('CompanyOrContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyOrContactService]
    });
  });

  it('should be created', inject([CompanyOrContactService], (service: CompanyOrContactService) => {
    expect(service).toBeTruthy();
  }));
});
