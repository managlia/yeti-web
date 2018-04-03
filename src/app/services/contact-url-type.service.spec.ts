import { TestBed, inject } from '@angular/core/testing';

import { ContactUrlTypeService } from './contact-url-type.service';

describe('ContactUrlTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactUrlTypeService]
    });
  });

  it('should be created', inject([ContactUrlTypeService], (service: ContactUrlTypeService) => {
    expect(service).toBeTruthy();
  }));
});
