import { TestBed, inject } from '@angular/core/testing';

import { ContactTitleTypeService } from './contact-title-type.service';

describe('ContactTitleTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactTitleTypeService]
    });
  });

  it('should be created', inject([ContactTitleTypeService], (service: ContactTitleTypeService) => {
    expect(service).toBeTruthy();
  }));
});
