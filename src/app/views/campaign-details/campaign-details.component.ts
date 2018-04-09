import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import { MatStepper } from '@angular/material';

import { DataStore } from '../../classes/data-store';
import { CompanyService } from '../../services/company.service';
import { ContactService } from '../../services/contact.service';
import { CampaignService } from '../../services/campaign.service';
import { ActionService } from '../../services/action.service';
import { EntityService } from '../../services/entity.service';
import { Campaign } from '../../classes/campaign';
import { CampaignClassificationType } from '../../classes/types/campaign-classification-type';
import { CampaignClassificationTypeService } from '../../services/campaign-classification-type.service';

import { ScopeType } from '../../classes/types/scope-type';
import { ScopeTypeService } from '../../services/scope-type.service';
import {Contact} from '../../classes/contact';
import {Company} from '../../classes/company';
import {Action} from '../../classes/action';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit {
  campaignUpdated = false;
  campaignFailureUpdated = false;
  companyFlag = false;
  contactFlag = false;
  actionFlag = false;
  companyFailureFlag = false;
  contactFailureFlag = false;
  actionFailureFlag = false;

  isLinear: true;
  campaign: Campaign;
  campaigns: Campaign[];
  scopeTypes: ScopeType[];
  classificationTypes: CampaignClassificationType[];
  targetStatement = 'Target Completion';
  actualStatement = 'Actual Completion';
  @ViewChild('stepper') stepper: MatStepper;

  entity: string;
  entityId: string;

  constructor(
    private dataStore: DataStore,
    private companyService: CompanyService,
    private contactService: ContactService,
    private campaignService: CampaignService,
    private actionService: ActionService,
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
    private scopeTypeService: ScopeTypeService,
    private campaignClassificationTypeService: CampaignClassificationTypeService
  ) {
    this.getCampaign()
    this.getScopeTypes();
    this.getCampaignClassificationTypes();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  getCampaign(): void {
    const campaignId = this.route.snapshot.paramMap.get('id');
    if( campaignId ) {
      this.campaignService.getCampaign(campaignId)
        .subscribe(campaign => this.completeCampaign(campaign));
    } else {
      this.campaign = new Campaign();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      if ( this.entity ) {
        if ( this.entity === 'company' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'contact' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'action' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        }
      }
    }
  }

  completeCampaign(campaign: Campaign): void {
    this.campaign = campaign;
    if ( this.campaign.ownerId ) {
      this.entityService.getContactById(this.campaign.ownerId)
        .subscribe(contact => this.campaign.owner = contact);
    }
  }

  /** add update campaign **/
  addUpdateCampaign() {
    const campaignId = this.campaign.campaignId;
    if ( campaignId ) {
      console.log(`This is an update because campaign id is ${campaignId}`);
      this.campaignService.updateCampaign(this.campaign).subscribe(feedback => this.showAssocationSuccessful('campaign')  );
    } else {
      console.log(`This is an ADD because campaign id is ${campaignId}`);
      this.campaign.ownerId = this.dataStore.userId;
      if ( this.entity && this.entityId ) {
        this.addCampaignAndAssociation(this.campaign, this.entity, this.entityId);
      } else {
        this.campaignService.addCampaign(this.campaign).subscribe(
          response => this.updateRoute(response.headers.get('Location')) );
      }
    }
  }

  completeAssociation( location: string, entity: string, entityId: string ) {
    const locattionNodes = _.split( location, '/' );
    const newId = _.last(locattionNodes);
    if ( entity === 'company' ) {
      this.companyService.getCompany(entityId).toPromise().then(
        company => this.campaignService.addCampaignToCompany( company, newId ).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if ( entity === 'contact' ) {
      this.contactService.getContact(entityId).toPromise().then(
        contact => this.campaignService.addCampaignToContact( contact, newId ).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if ( entity === 'action' ) {
      this.actionService.getAction(entityId).toPromise().then(
        action => this.campaignService.addCampaignToAction( action, newId ).subscribe(
          response => this.updateRoute(location)
        )
      );
    }
  }

  addCampaignAndAssociation(campaign: Campaign, entity: string, entityId: string) {
    const simpleHeaders = { responseType: 'text', observe: 'response' };
    this.campaignService.addCampaign(campaign).toPromise().then(
      response => this.completeAssociation(response.headers.get('Location'), entity, entityId)
    );
  }

  updateRoute( location: string ) {
    const locattionNodes = _.split( location, '/' );
    const newId = _.last(locattionNodes);
    this.router.navigateByUrl( `/campaign/${newId}` );
    this.showAssocationSuccessful('campaign');
  }

  onCompanyAssociatedToEntity(company: Company) {
    console.log('onCompanyAssociatedToEntity:: end');
    if ( this.campaign && company ) {
      this.campaignService.addCampaignToCompany(company, this.campaign.campaignId )
        .subscribe(response => {
          console.log('addCampaignToCompany:: completed');
          this.showAssocationSuccessful('company');
        }, error => {
          this.handleAssociationFailure('company');
        } );
    }
  }

  onCompanyFlaggedForRemoval(companyId: string) {
    if ( this.campaign && companyId ) {
      this.campaignService.removeCampaignFromCompany(companyId, this.campaign.campaignId )
        .subscribe(response => {
          console.log('onCompanyFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('company');
        }, error => {
          this.handleAssociationFailure('company');
        } );
    }
  }

  onContactAssociatedToEntity(contact: Contact) {
    console.log('onContactAssociatedToEntity:: end');
    if ( this.campaign && contact ) {
      this.campaignService.addCampaignToContact(contact, this.campaign.campaignId )
        .subscribe(response => {
          console.log('addCampaignToContact:: completed');
          this.showAssocationSuccessful('contact');
        }, error => {
          this.handleAssociationFailure('contact');
        } );
    }
  }

  onContactFlaggedForRemoval(contactId: string) {
    if ( this.campaign && contactId ) {
      this.campaignService.removeCampaignFromContact(contactId, this.campaign.campaignId )
        .subscribe(response => {
          console.log('onContactFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('contact');
        }, error => {
          this.handleAssociationFailure('contact');
        } );
    }
  }

  onActionAssociatedToEntity(action: Action): void {
    console.log('onActionAssociatedToEntity:: end');
    if ( this.campaign && action ) {
      this.campaignService.addCampaignToAction(action, this.campaign.campaignId)
        .subscribe(response => {
          console.log('onActionAssociatedToEntity:: completed');
          this.showAssocationSuccessful('action');
        }, error => {
          this.handleAssociationFailure('action');
        } );
    }
  }

  onActionFlaggedForRemoval(actionId: string) {
    if ( this.campaign && actionId ) {
      this.campaignService.removeCampaignFromAction(actionId, this.campaign.campaignId)
        .subscribe(response => {
          console.log('onCampaignFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('action');
        }, error => {
          this.handleAssociationFailure('action');
        } );
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleAssociationFailure(entity: string, response?: any): void {
    if (entity === 'company') {
      this.companyFailureFlag = true;
    } else if (entity === 'contact') {
      this.contactFailureFlag = true;
    } else if (entity === 'action') {
      this.actionFailureFlag = true;
    } else if ( entity === 'campaign' ) {
      this.campaignFailureUpdated = true;
    }
    this.waitAndReset(entity);
  }

  showAssocationSuccessful(entity: string, response?: any): void {
    if ( entity === 'company' ) {
      this.companyFlag = true;
    } else if ( entity === 'campaign' ) {
      this.campaignUpdated = true;
    } else if ( entity === 'contact' ) {
      this.contactFlag = true;
    } else if ( entity === 'action' ) {
      this.actionFlag = true;
    }
    this.waitAndReset(entity);
  }

  waitAndReset(entity: string): void {
    this.delay(4000).then(resolve => {
        if ( entity === 'company' ) {
          this.companyFlag = false;
          this.companyFailureFlag = false;
        } else if ( entity === 'campaign' ) {
          this.campaignUpdated = false;
          this.campaignFailureUpdated = false;
        } else if ( entity === 'contact' ) {
          this.contactFlag = false;
          this.contactFailureFlag = false;
        } else if ( entity === 'action' ) {
          this.actionFlag = false;
          this.actionFailureFlag = false;
        }
    });
  }

  getScopeTypes(): void {
    this.scopeTypeService.getScopeTypeList()
      .subscribe(scopeTypes => this.scopeTypes = scopeTypes);
  }

  getCampaignClassificationTypes(): void {
    this.campaignClassificationTypeService.getCampaignClassificationTypeList()
      .subscribe(classificationTypes => this.classificationTypes = classificationTypes);
  }

  addNewContactToAction(event): void {
    console.log('placeholder: add new contact to action trigger', event);
  }

  createAndLinkAction(event): void {
    if ( event.checked ) {
      console.log('placeholder: create new action and link it to this campaign', event);
    }
  }

  linkToExistingAction(event): void {
    if ( event.checked ) {
      console.log('placeholder: link this campaign to existing action', event);
    }
  }

}
