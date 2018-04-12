import {Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import {AdderComponent} from '../../base/adder/adder.component';
import {CampaignOrAction} from '../../../classes/common/campaign-or-action';
import {Action} from '../../../classes/action';

@Component({
  selector: 'app-action-adder',
  templateUrl: './action-adder.component.html',
  styleUrls: ['./action-adder.component.css']
})
export class ActionAdderComponent extends AdderComponent implements OnInit {

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.campaignOrActionService.searchAction(term) ),
    );
    this.results$
      .subscribe(results => this.results = this.excludeAlreadyAssociated(results, this.existingEntities) );
  }

  onOptionSelected(selectedItem: CampaignOrAction): void {
    const actionId = selectedItem.actionId;
    this.actionService.getAction(actionId)
      .subscribe(action => {
        this.existingEntities.push(action);
        this.onEntityAdded.emit(action);
        this.viewSearch = false;
      } );
  }

  excludeAlreadyAssociated(resultElements: CampaignOrAction[], filterArray: Action[]) {
    const filteredArray = _.filter(resultElements, function(o) {
      const matchId = o.actionId;
      const compareList = _.map(filterArray, 'actionId' );
      const isMatch = _.indexOf( compareList,  matchId) > -1;
      return !isMatch;
    });
    return filteredArray;
  }

}
