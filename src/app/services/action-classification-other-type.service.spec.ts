import { TestBed, inject } from '@angular/core/testing';

import { ActionClassificationOtherTypeService } from './action-classification-other-type.service';

describe('ActionClassificationOtherTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionClassificationOtherTypeService]
    });
  });

  it('should be created', inject([ActionClassificationOtherTypeService], (service: ActionClassificationOtherTypeService) => {
    expect(service).toBeTruthy();
  }));
});
