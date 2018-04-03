import {Component, OnInit, OnChanges, Input, Output, Renderer, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { Campaign } from '../../classes/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.css']
})

export class CampaignCardComponent implements OnInit {

  @Input() companyId: string;
  @Input() actionId: string;
  @Input() contactId: string;
  @Input() associationSuccessful = false;
  @Output() onCampaignFlaggedForRemoval = new EventEmitter<Campaign>();
  @Output() onCampaignAssociatedToEntity = new EventEmitter<Campaign>();

  campaigns: Campaign[];

  fontColor = 'black';

  constructor(
    private campaignService: CampaignService,
    public renderer: Renderer,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(`companyCardComponent this.companyId is ${this.companyId}`);
    console.log(`companyCardComponent this.actionId is ${this.actionId}`);
    console.log(`companyCardComponent this.contactId is ${this.contactId}`);
    if (this.companyId) {
      this.getCampaignsByCustomerId();
    } else if (this.actionId) {
      this.getCampaignsByActionId();
    } else if (this.contactId) {
      this.getCampaignsByContactId();
    } else {
      this.campaigns = [];
    }
  }

  onCampaignAdded(campaign: Campaign) {
    console.log('onCampaignAdded / onCampaignAssociatedToEntity');
    this.onCampaignAssociatedToEntity.emit(campaign);
  }

  removeCampaign(campaign: Campaign) {
    this.onCampaignFlaggedForRemoval.emit(campaign);
    _.remove(this.campaigns, {
      campaignId: campaign.campaignId
    });
  }

  getCampaignsByCustomerId(): void {
    this.campaignService.getCampaignListByCompany( this.companyId )
      .subscribe(campaigns => this.campaigns = campaigns );
  }

  getCampaignsByActionId(): void {
    console.log(`dfmdfm getting campaigns by action id ${this.actionId}`);
    this.campaignService.getCampaignListByAction( this.actionId )
      .subscribe(campaigns => this.campaigns = campaigns );
  }

  getCampaignsByContactId(): void {
    this.campaignService.getCampaignListByContact( this.contactId )
      .subscribe(campaigns => this.campaigns = campaigns );
  }

  createNewCampaign(): void {
    console.log('ready to add a new campaign');
    if (this.companyId) {
      this.router.navigateByUrl( `/campaign/add/company/${this.companyId}` );
    } else if (this.actionId) {
      this.router.navigateByUrl( `/campaign/add/action/${this.actionId}` );
    } else if (this.contactId) {
      this.router.navigateByUrl( `/campaign/add/contact/${this.contactId}` );
    }
  }

  onConsideringCampaign($event, thediv): void {
    const target =  event.currentTarget || event.target || event.srcElement ;
    this.renderer.setElementStyle(target, 'color', 'rebeccapurple');
    this.renderer.setElementStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringCampaign($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setElementStyle(target, 'color', this.fontColor);
  }

  onSelectedCampaign($event, campaignId): void {
    console.log(`clicked on ${campaignId}`);
    this.router.navigateByUrl( `/campaign/${campaignId}` );
  }

}

