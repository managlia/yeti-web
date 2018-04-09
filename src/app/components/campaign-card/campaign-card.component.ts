import {Component, OnInit,  Output, EventEmitter} from '@angular/core';
import * as _ from 'lodash';

import { Campaign } from '../../classes/campaign';
import { CardComponent } from '../base/card/card.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.css']
})
/* Component used to add and remove Campaigns from Actionm Company, and Contact entities. */
export class CampaignCardComponent extends CardComponent implements OnInit {

  @Output() onCampaignFlaggedForRemoval = new EventEmitter<string>();
  @Output() onCampaignAssociatedToEntity = new EventEmitter<Campaign>();

  ngOnInit() {
    if (this.companyId) {
      this.getCampaignsByCustomerId();
    } else if (this.actionId) {
      this.getCampaignsByActionId();
    } else if (this.contactId) {
      this.getCampaignsByContactId();
    } else {
      this.entities = [];
    }
  }

  getCampaignsByCustomerId(): void {
    this.campaignService.getCampaignListByCompany( this.companyId )
      .subscribe(campaigns => this.entities = campaigns );
  }

  getCampaignsByActionId(): void {
    this.campaignService.getCampaignListByAction( this.actionId )
      .subscribe(campaigns => this.entities = campaigns );
  }

  getCampaignsByContactId(): void {
    this.campaignService.getCampaignListByContact( this.contactId )
      .subscribe(campaigns => this.entities = campaigns );
  }

  onCampaignAdded(campaign: Campaign) {
    this.onCampaignAssociatedToEntity.emit(campaign);
    this.suspendedUndoEvent  = new Observable<any>(observer => {
      this.entities = this.entities.filter(e => e.campaignId !== campaign.campaignId);
      observer.next('undone');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  removeCampaign(campaignId: string) {
    console.log('removing campaignId ', campaignId);
    this.onCampaignFlaggedForRemoval.emit(campaignId);
    this.suspendedEvent = new Observable<any> ( observer => {
      this.entities = this.entities.filter( e => e.campaignId !== campaignId );
      observer.next('success');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  createNewCampaign(): void {
    if (this.companyId) {
      this.router.navigateByUrl( `/campaign/add/company/${this.companyId}` );
    } else if (this.actionId) {
      this.router.navigateByUrl( `/campaign/add/action/${this.actionId}` );
    } else if (this.contactId) {
      this.router.navigateByUrl( `/campaign/add/contact/${this.contactId}` );
    }
  }

  onSelectedCampaign($event, campaignId): void {
    this.router.navigateByUrl( `/campaign/${campaignId}` );
  }
}
