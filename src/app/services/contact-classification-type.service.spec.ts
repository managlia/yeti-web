import { TestBed, inject } from '@angular/core/testing';

import { ContactClassificationTypeService } from './contact-classification-type.service';

describe('ContactClassificationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactClassificationTypeService]
    });
  });

  it('should be created', inject([ContactClassificationTypeService], (service: ContactClassificationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
