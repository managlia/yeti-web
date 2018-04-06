import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import * as stringify from 'json-stringify-safe';
import * as _ from 'lodash';

import { CompanyService } from '../../services/company.service';
import { ContactService } from '../../services/contact.service';
import { CampaignService } from '../../services/campaign.service';
import { ActionService } from '../../services/action.service';

import { Company } from '../../classes/company';
import { EntityClassificationType } from '../../classes/types/entity-classification-type';
import { AddressClassificationType } from '../../classes/types/address-classification-type';
import { UrlType } from '../../classes/types/url-type';
import { CompanyClassificationTypeService } from '../../services/company-classification-type.service';
import { CompanyAddressClassificationTypeService } from '../../services/company-address-classification-type.service';
import { CompanyUrlTypeService } from '../../services/company-url-type.service';
import {Contact} from '../../classes/contact';
import {Campaign} from '../../classes/campaign';
import {Action} from '../../classes/action';
import {Address} from '../../classes/common/address';
import {AddressCardComponent} from '../../components/address-card/address-card.component';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  @ViewChild(AddressCardComponent) addressCard: AddressCardComponent;

  companyUpdated = false;
  actionFlag = false;
  contactFlag = false;
  campaignFlag = false;
  addressIsDirty = false;

  companyFormGroup: FormGroup;
  company: Company;
  urlTypes: UrlType[];
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
    private companyUrlTypeService: CompanyUrlTypeService,
    private companyClassificationTypeService: CompanyClassificationTypeService,
    private companyAddressClassificationTypeService: CompanyAddressClassificationTypeService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getCompany();
    this.getCompanyUrlTypes();
    this.getCompanyTypes();
    this.getCompanyAddressTypes();
    this.createForm();
  }

  createForm() {
    this.companyFormGroup = this.fb.group({ // <-- the parent FormGroup
      companyName: '',
      companyClassification: '',
      externalId: '',
      description: ''
    });
  }

  /** get company **/
  getCompany(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if ( companyId ) {
      this.companyService.getCompany(companyId)
        .subscribe(company => this.company = company);
    } else {
      this.company = new Company();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      if ( this.entity ) {
        if ( this.entity === 'contact' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'campaign' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'action' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        }
      }
    }
  }

  /** add update company **/
  addUpdateCompany() {
    const companyId = this.company.companyId;
    if ( companyId ) {
      console.log(`This is an update because company id is ${companyId}`);
      this.companyService.updateCompany(this.company).subscribe(result => {
          console.log('what is the result of the updated company???', result);
          this.showAssocationSuccessful('company');
      });
    } else {
      console.log(`This is an ADD because company id is ${companyId}`);
      if ( this.entity && this.entityId ) {
        this.addCompanyAndAssociation(this.company, this.entity, this.entityId);
      } else {
        this.companyService.addCompany(this.company).subscribe(
          response => this.updateRoute(response.headers.get('Location')));
      }
    }
  }

  completeAssociation( location: string, entity: string, entityId: string ) {
    const locattionNodes = _.split( location, '/' );
    const newId = _.last(locattionNodes);
    if ( entity === 'action' ) {
      this.actionService.getAction(entityId).toPromise().then(
        action => this.companyService.addActionToCompany( newId, action ).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if ( entity === 'contact' ) {
      this.contactService.getContact(entityId).toPromise().then(
        contact => this.companyService.addContactToCompany( newId, contact ).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if ( entity === 'campaign' ) {
      this.campaignService.getCampaign(entityId).toPromise().then(
        campaign => this.companyService.addCampaignToCompany( newId, campaign ).subscribe(
          response => this.updateRoute(location)
        )
      );
    }
  }

  addCompanyAndAssociation(company: Company, entity: string, entityId: string) {
    const simpleHeaders = { responseType: 'text', observe: 'response' };
    this.companyService.addCompany(company).toPromise().then(
      response => this.completeAssociation(response.headers.get('Location'), entity, entityId)
    );
  }

  updateRoute( location: string ) {
    const locattionNodes = _.split( location, '/' );
    const newId = _.last(locattionNodes);
    this.router.navigateByUrl( `/company/${newId}` );
    this.showAssocationSuccessful('company');
  }

  /** types **/
  getCompanyTypes(): void {
    this.companyClassificationTypeService.getCompanyClassificationTypeList()
      .subscribe(companyTypes => this.classificationTypes = companyTypes);
  }

  /** types **/
  getCompanyAddressTypes(): void {
    this.companyAddressClassificationTypeService.getCompanyAddressClassificationTypeList()
      .subscribe(addressTypes => this.addressClassificationTypes = addressTypes);
  }

  /** types **/
  getCompanyUrlTypes(): void {
    this.companyUrlTypeService.getUrlTypeList()
      .subscribe(urlTypes => this.urlTypes = urlTypes);
  }

  onContactAssociatedToEntity(contact: Contact): void {
    console.log('onContactAssociatedToEntity:: end');
    if ( this.company && contact ) {
      this.companyService.addContactToCompany(this.company.companyId, contact )
        .subscribe(response => {
          console.log('onContactAssociatedToEntity:: completed');
          this.showAssocationSuccessful('contact');
        } );
    }
  }

  onContactFlaggedForRemoval(contact: Contact) {
    if ( this.company && contact ) {
      this.companyService.removeContactFromCompany(this.company.companyId, contact.contactId )
        .subscribe(response => {
          console.log('onCompanyFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('contact');
        } );
    }
  }
  onCampaignAssociatedToEntity(campaign: Campaign): void {
    console.log('onCampaignAssociatedToEntity:: end');
    if ( this.company && campaign ) {
      this.companyService.addCampaignToCompany(this.company.companyId, campaign )
        .subscribe(response => {
          console.log('onCampaignAssociatedToEntity:: completed');
          this.showAssocationSuccessful('campaign');
        } );
    }
  }

  onCampaignFlaggedForRemoval(campaign: Campaign) {
    if ( this.company && campaign ) {
      this.companyService.removeCampaignFromCompany(this.company.companyId, campaign.campaignId )
        .subscribe(response => {
          console.log('onCompanyFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('campaign');
        } );
    }
  }

  onActionAssociatedToEntity(action: Action): void {
    console.log('onActionAssociatedToEntity:: end');
    if ( this.company && action ) {
      this.companyService.addActionToCompany(this.company.companyId, action )
        .subscribe(response => {
          console.log('onActionAssociatedToEntity:: completed');
          this.showAssocationSuccessful('action');
        } );
    }
  }

  onActionFlaggedForRemoval(action: Action) {
    if ( this.company && action ) {
      this.companyService.removeActionFromCompany(this.company.companyId, action.actionId )
        .subscribe(response => {
          console.log('onCompanyFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('action');
        } );
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showAssocationSuccessful(entity: string): void {
    if ( entity === 'company' ) {
      this.companyUpdated = true;
      this.addressCard.writeCopyFromOriginal();
    } else if ( entity === 'campaign' ) {
      this.campaignFlag = true;
    } else if ( entity === 'contact' ) {
      this.contactFlag = true;
    } else if ( entity === 'action' ) {
      this.actionFlag = true;
    }
    this.delay(4000).then(resolve => {
        if ( entity === 'company' ) {
          this.companyUpdated = false;
        } else if ( entity === 'campaign' ) {
          this.campaignFlag = false;
        } else if ( entity === 'contact' ) {
          this.contactFlag = false;
        } else if ( entity === 'action' ) {
          this.actionFlag = false;
        }
      }
    );
  }

  addressesChanged(addresses: Address[]): void {
    console.log('making the addresses dirty!!!');
    this.addressIsDirty = true;
  }
}
