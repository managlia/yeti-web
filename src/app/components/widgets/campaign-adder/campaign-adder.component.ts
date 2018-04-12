import {Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import {AdderComponent} from '../../base/adder/adder.component';
import {CampaignOrAction} from '../../../classes/common/campaign-or-action';
import {Campaign} from '../../../classes/campaign';

@Component({
  selector: 'app-campaign-adder',
  templateUrl: './campaign-adder.component.html',
  styleUrls: ['./campaign-adder.component.css']
})
export class CampaignAdderComponent extends AdderComponent implements OnInit {

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.campaignOrActionService.searchCampaign(term) ),
    );
    this.results$
      .subscribe(results => this.results = this.excludeAlreadyAssociated(results, this.existingEntities) );
  }

  onOptionSelected(selectedItem: CampaignOrAction): void {
    const campaignId = selectedItem.campaignId;
    this.campaignService.getCampaign(campaignId)
      .subscribe(campaign => {
        this.existingEntities.push(campaign);
        this.onEntityAdded.emit(campaign);
        this.viewSearch = false;
      } );
  }

  excludeAlreadyAssociated(resultElements: CampaignOrAction[], filterArray: Campaign[]) {
    const filteredArray = _.filter(resultElements, function(o) {
      const matchId = o.campaignId;
      const compareList = _.map(filterArray, 'campaignId' );
      const isMatch = _.indexOf( compareList,  matchId) > -1;
      return !isMatch;
    });
    return filteredArray;
  }
}
