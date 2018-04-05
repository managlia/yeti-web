import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import * as _ from 'lodash';

import { CompanyService } from '../../services/company.service';
import { ContactService } from '../../services/contact.service';
import { CampaignService } from '../../services/campaign.service';
import { ActionService } from '../../services/action.service';
import { Contact } from '../../classes/contact';
import { EntityClassificationType } from '../../classes/types/entity-classification-type';
import { AddressClassificationType } from '../../classes/types/address-classification-type';
import { ContactTitleType } from '../../classes/types/contact-title-type';
import { ContactClassificationTypeService } from '../../services/contact-classification-type.service';
import { ContactAddressClassificationTypeService } from '../../services/contact-address-classification-type.service';
import { ContactUrlTypeService } from '../../services/contact-url-type.service';
import { ContactTitleTypeService } from '../../services/contact-title-type.service';
import { UrlType } from '../../classes/types/url-type';

import {Company} from '../../classes/company';
import {Campaign} from '../../classes/campaign';
import {Action} from '../../classes/action';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  contactUpdated = false;
  companyFlag = false;
  campaignFlag = false;
  actionFlag = false;

  contactFailureUpdated = false;
  companyFailureFlag = false;
  campaignFailureFlag = false;
  actionFailureFlag = false;

  contactId: string;
  contact: Contact;
  urlTypes: UrlType[];
  titleTypes: ContactTitleType[];
  classificationTypes: EntityClassificationType[];
  addressClassificationTypes: AddressClassificationType[];

  entity: string;
  entityId: string;

  constructor(
    private companyService: CompanyService,
    private contactService: ContactService,
    private campaignService: CampaignService,
    private actionService: ActionService,
    private route: ActivatedRoute,
    private router: Router,
    private contactClassificationTypeService: ContactClassificationTypeService,
    private contactAddressClassificationTypeService: ContactAddressClassificationTypeService,
    private contactUrlTypeService: ContactUrlTypeService,
    private contactTitleTypeService: ContactTitleTypeService,
    private location: Location
  ) {
    this.getContactsById();
    this.getContactAddressTypes();
    this.getContactUrlTypes();
    this.getContactTypes();
    this.getContactTitleTypes();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  getContactsById(): void {
    this.contactId = this.route.snapshot.paramMap.get('id');
    if ( this.contactId ) {
      this.contactService.getContact( this.contactId )
        .subscribe(contact => this.contact = contact );
    } else {
      this.contact = new Contact();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      if ( this.entity ) {
        if ( this.entity === 'company' ) {
          this.contact.companyId = this.entityId;
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'campaign' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'action' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        }
      }
    }
  }

  /** add update contact **/
  addUpdateContact() {
    const contactId = this.contact.contactId;
    if ( contactId ) {
      this.contactService.updateContact(this.contact).subscribe(feedback => this.showAssocationSuccessful('contact'));
    } else {
      if ( this.entity && this.entityId ) {
        this.addContactAndAssociation(this.contact, this.entity, this.entityId);
      } else {
        this.contactService.addContact(this.contact).subscribe(
          response => this.updateRoute(response.headers.get('Location')));
      }
    }
  }

  completeAssociation( location: string, entity: string, entityId: string ) {
    const locattionNodes = _.split( location, '/' );
    const newId = _.last(locattionNodes);
    if ( entity === 'company' ) {
        /*
          this.companyService.getCompany(entityId).toPromise().then(
            company => this.contactService.addCompanyToContact( newId, company ).subscribe(
              response => this.updateRoute(location)
            )
          );
        */
    } else if ( entity === 'action' ) {
      this.actionService.getAction(entityId).toPromise().then(
        action => this.contactService.addActionToContact( newId, action ).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if ( entity === 'campaign' ) {
      this.campaignService.getCampaign(entityId).toPromise().then(
        campaign => this.contactService.addCampaignToContact( newId, campaign ).subscribe(
          response => this.updateRoute(location)
        )
      );
    }
  }

  addContactAndAssociation(contact: Contact, entity: string, entityId: string) {
    const simpleHeaders = { responseType: 'text', observe: 'response' };
    this.contactService.addContact(contact).toPromise().then(
      response => this.completeAssociation(response.headers.get('Location'), entity, entityId)
    );
  }

  updateRoute( location: string ) {
    const locattionNodes = _.split( location, '/' );
    const newId = _.last(locattionNodes);
    this.router.navigateByUrl( `/contact/${newId}` );
    this.showAssocationSuccessful('contact');
  }

  getContactTypes(): void {
    this.contactClassificationTypeService.getContactClassificationTypeList()
      .subscribe(contactTypes => this.classificationTypes = contactTypes);
  }

  getContactAddressTypes(): void {
    this.contactAddressClassificationTypeService.getContactAddressClassificationTypeList()
      .subscribe(addressTypes => this.addressClassificationTypes = addressTypes);
  }

  getContactUrlTypes(): void {
    this.contactUrlTypeService.getUrlTypeList()
      .subscribe(urlTypes => this.urlTypes = urlTypes);
  }

  getContactTitleTypes(): void {
    this.contactTitleTypeService.getTitleTypeList()
      .subscribe(titleTypes => this.titleTypes = titleTypes);
  }

  selectCompany(): void {
    console.log('selectCompany / selectCompany');
    const companyId = this.contact.companyId;
    this.router.navigateByUrl( `/company/${companyId}` );
  }

  onCompanyChosen(companyId: string): void {
    console.log('onCompanyChosen / onCompanyChosen ', companyId);
    this.contact.companyId = companyId;
    const contactId = this.contact.contactId;
    if ( contactId ) {
      // is an update - should go ahead and update backend
      this.contactService.updateContact(this.contact).subscribe(feedback => this.showAssocationSuccessful('company'));
    }
  }

  onCampaignAssociatedToEntity(campaign: Campaign): void {
    console.log('onCampaignAssociatedToEntity:: end');
    if ( this.contact && campaign ) {
      this.contactService.addCampaignToContact(this.contact.contactId, campaign )
        .subscribe(response => this.showAssocationSuccessful('action', response),
          response => this.handleAssociationFailure('campaign', response),
        );
    }
  }

  onCampaignFlaggedForRemoval(campaign: Campaign) {
    if ( this.contact && campaign ) {
      this.contactService.removeCampaignFromContact(this.contact.contactId, campaign.campaignId )
        .subscribe(response => this.showAssocationSuccessful('action', response),
          response => {
            this.handleAssociationFailure('campaign', response);
          }
        );
    }
  }

  onActionAssociatedToEntity(payload: any): void {
    const actions = payload.entities;
    const action = payload.action;
    if ( this.contact && action ) {
      this.contactService.addActionToContact(this.contact.contactId, action )
        .subscribe(response => this.showAssocationSuccessful('action', response),
          response =>  {
            actions.filter(anAction => anAction === action);
            this.handleAssociationFailure('action', response);
          }
        );
    }
  }

  onActionFlaggedForRemoval(payload: any): void {
    const actions = payload.entities;
    const action = payload.action;
    if ( this.contact && action ) {
      this.contactService.removeActionFromContact(this.contact.contactId, action.actionId )
        .subscribe(response => this.showAssocationSuccessful('action', response),
          response => {
            actions.push(action);
            this.handleAssociationFailure('action', response);
          }
        );
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleAssociationFailure(entity: string, resposne?: any): void {
    if (entity === 'company') {
      this.companyFailureFlag = true;
    } else if (entity === 'campaign') {
      this.campaignFailureFlag = true;
    } else if (entity === 'contact') {
      this.contactFailureUpdated = true;
    } else if (entity === 'action') {
      this.actionFailureFlag = true;
    }
    this.waitAndReset(entity);
  }

  showAssocationSuccessful(entity: string, resposne?: any): void {
    if (entity === 'company') {
      this.companyFlag = true;
    } else if (entity === 'campaign') {
      this.campaignFlag = true;
    } else if (entity === 'contact') {
      this.contactUpdated = true;
    } else if (entity === 'action') {
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
            this.campaignFlag = false;
            this.campaignFailureFlag = false;
          } else if ( entity === 'contact' ) {
            this.contactUpdated = false;
            this.contactFailureUpdated = false;
          } else if ( entity === 'action' ) {
            this.actionFlag = false;
            this.actionFailureFlag = false;
          }
        }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
