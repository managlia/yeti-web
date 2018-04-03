import { TestBed, inject } from '@angular/core/testing';

import { ActionClassificationTypeService } from './action-classification-type.service';

describe('ActionClassificationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionClassificationTypeService]
    });
  });

  it('should be created', inject([ActionClassificationTypeService], (service: ActionClassificationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
