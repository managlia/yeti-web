import {Component, OnInit, Input, OnChanges, EventEmitter, Output, SimpleChanges} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {Observable } from 'rxjs/Observable';
import { CampaignOrAction } from '../../../classes/common/campaign-or-action';
import { Action } from '../../../classes/action';
import { CampaignOrActionService } from '../../../services/campaign-or-action.service';
import { ActionService } from '../../../services/action.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-action-adder',
  templateUrl: './action-adder.component.html',
  styleUrls: ['./action-adder.component.css']
})
export class ActionAdderComponent implements OnInit, OnChanges {
  myControl: FormControl = new FormControl();

  @Input() existingActions: Action[];
  @Output() onActionAdded = new EventEmitter<Action>();

  results$: Observable<CampaignOrAction[]>;
  results: CampaignOrAction[];
  viewSearch = false;

  private searchTerms = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private campaignOrActionService: CampaignOrActionService,
    private actionService: ActionService
  ) { }

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.campaignOrActionService.searchAction(term) ),
    );
    this.results$
      .subscribe(results => this.results = this.excludeAlreadyAssociated(results, this.existingActions) );
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.onActionAdded.emit(this.existingActions);
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  addNewAction(): void {
    this.myControl = new FormControl();
    this.viewSearch = true;
  }

  onOptionSelected(selectedCoc): void {
    const actionId = selectedCoc.actionId;
    console.log( `gotta get the action id for ${actionId}`);
    this.actionService.getAction(actionId)
      .subscribe(action => {
        this.existingActions.push(action);
        console.log('onOptionSelected / onActionAdded');
        this.onActionAdded.emit(action);
        this.viewSearch = false;
      } );
  }

  excludeAlreadyAssociated(resultElements: CampaignOrAction[], filterArray: Action[]) {
    console.log( 'result elements', resultElements  );
    console.log( 'filter array', filterArray  );

    const filteredArray = _.filter(resultElements, function(o) {
      const matchId = o.actionId;
      const compareList = _.map(filterArray, 'actionId' );
      const isMatch = _.indexOf( compareList,  matchId) > -1;
      return !isMatch;
    });
    return filteredArray;
  }

}
