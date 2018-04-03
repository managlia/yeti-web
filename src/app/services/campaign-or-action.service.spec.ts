import { TestBed, inject } from '@angular/core/testing';

import { CampaignOrActionService } from './campaign-or-action.service';

describe('CampaignOrActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignOrActionService]
    });
  });

  it('should be created', inject([CampaignOrActionService], (service: CampaignOrActionService) => {
    expect(service).toBeTruthy();
  }));
});
