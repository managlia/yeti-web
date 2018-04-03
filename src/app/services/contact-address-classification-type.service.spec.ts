import { TestBed, inject } from '@angular/core/testing';

import { ContactAddressClassificationTypeService } from './contact-address-classification-type.service';

describe('ContactAddressClassificationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactAddressClassificationTypeService]
    });
  });

  it('should be created', inject([ContactAddressClassificationTypeService], (service: ContactAddressClassificationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
