import { TestBed, inject } from '@angular/core/testing';

import { ActionQuickEditService } from './action-quick-edit.service';

describe('ActionQuickEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionQuickEditService]
    });
  });

  it('should be created', inject([ActionQuickEditService], (service: ActionQuickEditService) => {
    expect(service).toBeTruthy();
  }));
});
