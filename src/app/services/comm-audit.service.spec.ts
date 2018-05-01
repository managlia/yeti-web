import { TestBed, inject } from '@angular/core/testing';

import { CommAuditService } from './comm-audit.service';

describe('CommAuditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommAuditService]
    });
  });

  it('should be created', inject([CommAuditService], (service: CommAuditService) => {
    expect(service).toBeTruthy();
  }));
});
