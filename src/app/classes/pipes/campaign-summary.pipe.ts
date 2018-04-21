import { Pipe, PipeTransform } from '@angular/core';
import * as tc from './text-constants';

import {Campaign} from '../campaign';

@Pipe({
  name: 'campaignSummary'
})
export class CampaignSummaryPipe implements PipeTransform {

  transform(campaign: Campaign): any {
    return `${tc.htmlTags.boldStart}${campaign.name}${tc.htmlTags.boldEnd}${tc.space}(${campaign.classificationType.name})`;
  }

}
