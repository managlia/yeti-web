import { TestBed, inject } from '@angular/core/testing';

import { ScopeTypeService } from './scope-type.service';

describe('ScopeTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScopeTypeService]
    });
  });

  it('should be created', inject([ScopeTypeService], (service: ScopeTypeService) => {
    expect(service).toBeTruthy();
  }));
});
