import { TestBed, inject } from '@angular/core/testing';

import { ContactPhoneTypeService } from './contact-phone-type.service';

describe('ContactPhoneTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactPhoneTypeService]
    });
  });

  it('should be created', inject([ContactPhoneTypeService], (service: ContactPhoneTypeService) => {
    expect(service).toBeTruthy();
  }));
});
