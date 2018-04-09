import { TestBed, inject } from '@angular/core/testing';

import { ContactPhoneService } from './contact-phone.service';

describe('ContactPhoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactPhoneService]
    });
  });

  it('should be created', inject([ContactPhoneService], (service: ContactPhoneService) => {
    expect(service).toBeTruthy();
  }));
});
