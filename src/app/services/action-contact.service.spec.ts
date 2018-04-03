import { TestBed, inject } from '@angular/core/testing';

import { ActionContactService } from './action-contact.service';

describe('ActionContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionContactService]
    });
  });

  it('should be created', inject([ActionContactService], (service: ActionContactService) => {
    expect(service).toBeTruthy();
  }));
});
