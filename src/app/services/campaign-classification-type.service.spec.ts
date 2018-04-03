import { TestBed, inject } from '@angular/core/testing';

import { CampaignClassificationTypeService } from './campaign-classification-type.service';

describe('CampaignClassificationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignClassificationTypeService]
    });
  });

  it('should be created', inject([CampaignClassificationTypeService], (service: CampaignClassificationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
