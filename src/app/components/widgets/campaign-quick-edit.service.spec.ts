import { TestBed, inject } from '@angular/core/testing';

import { CampaignQuickEditService } from './campaign-quick-edit.service';

describe('CapaignQuickEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignQuickEditService]
    });
  });

  it('should be created', inject([CampaignQuickEditService], (service: CampaignQuickEditService) => {
    expect(service).toBeTruthy();
  }));
});
