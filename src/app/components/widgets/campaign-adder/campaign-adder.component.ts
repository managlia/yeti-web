import {Component, OnInit, Input, OnChanges, EventEmitter, Output, SimpleChanges} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {Observable } from 'rxjs/Observable';
import { CampaignOrAction } from '../../../classes/common/campaign-or-action';
import { Campaign } from '../../../classes/campaign';
import { CampaignOrActionService } from '../../../services/campaign-or-action.service';
import { CampaignService } from '../../../services/campaign.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-campaign-adder',
  templateUrl: './campaign-adder.component.html',
  styleUrls: ['./campaign-adder.component.css']
})
export class CampaignAdderComponent implements OnInit, OnChanges {
  myControl: FormControl = new FormControl();

  @Input() existingCampaigns: Campaign[];
  @Output() onCampaignAdded = new EventEmitter<Campaign>();

  results$: Observable<CampaignOrAction[]>;
  results: CampaignOrAction[];
  viewSearch = false;

  private searchTerms = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private campaignOrActionService: CampaignOrActionService,
    private campaignService: CampaignService
  ) { }

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.campaignOrActionService.searchCampaign(term) ),
    );
    this.results$
      .subscribe(results => this.results = this.excludeAlreadyAssociated(results, this.existingCampaigns) );
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.onCampaignAdded.emit(this.existingCampaigns);
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  addNewCampaign(): void {
    this.myControl = new FormControl();
    this.viewSearch = true;
  }

  onOptionSelected(selectedCoc): void {
    const campaignId = selectedCoc.campaignId;
    console.log( `gotta get the campaign id for ${campaignId}`);
    this.campaignService.getCampaign(campaignId)
      .subscribe(campaign => {
        this.existingCampaigns.push(campaign);
        console.log('onOptionSelected / onCampaignAdded');
        this.onCampaignAdded.emit(campaign);
        this.viewSearch = false;
      } );
  }

  excludeAlreadyAssociated(resultElements: CampaignOrAction[], filterArray: Campaign[]) {
    console.log( 'result elements', resultElements  );
    console.log( 'filter array', filterArray  );

    const filteredArray = _.filter(resultElements, function(o) {
      const matchId = o.campaignId;
      const compareList = _.map(filterArray, 'campaignId' );
      const isMatch = _.indexOf( compareList,  matchId) > -1;
      return !isMatch;
    });
    return filteredArray;
  }

}
