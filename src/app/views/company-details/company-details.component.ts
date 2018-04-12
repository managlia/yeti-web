import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as _ from 'lodash';

import {CompanyService} from '../../services/company.service';
import {ContactService} from '../../services/contact.service';
import {CampaignService} from '../../services/campaign.service';
import {ActionService} from '../../services/action.service';

import {EntityClassificationType} from '../../classes/types/entity-classification-type';
import {AddressClassificationType} from '../../classes/types/address-classification-type';
import {CompanyClassificationTypeService} from '../../services/company-classification-type.service';
import {CompanyAddressClassificationTypeService} from '../../services/company-address-classification-type.service';
import {CompanyUrlTypeService} from '../../services/company-url-type.service';
import {CompanyPhoneTypeService} from '../../services/company-phone-type.service';

import {Action} from '../../classes/action';
import {Campaign} from '../../classes/campaign';
import {Company} from '../../classes/company';
import {Contact} from '../../classes/contact';
import {Address} from '../../classes/common/address';
import {AddressCardComponent} from '../../components/address-card/address-card.component';
import {Url} from '../../classes/common/url';
import {UrlType} from '../../classes/types/url-type';
import {Phone} from '../../classes/common/phone';
import {PhoneType} from '../../classes/types/phone-type';
import {Tag} from '../../classes/common/tag';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  @ViewChild(AddressCardComponent) addressCard: AddressCardComponent;

  companyUpdated = false;
  companyFailureUpdated = false;
  actionFlag = false;
  contactFlag = false;
  campaignFlag = false;
  actionFailureFlag = false;
  contactFailureFlag = false;
  campaignFailureFlag = false;
  addressIsDirty = false;
  urlsIsDirty = false;
  phonesIsDirty = false;
  tagsIsDirty = false;

  companyFormGroup: FormGroup;
  company: Company;
  urlTypes: UrlType[];
  phoneTypes: PhoneType[];
  classificationTypes: EntityClassificationType[];
  addressClassificationTypes: AddressClassificationType[];
  entity: string;
  entityId: string;
  updateLinks = (urls: Url[]) => {
    this.company.urls = urls;
    this.urlsIsDirty = true;
  };
  updatePhones = (phones: Phone[]) => {
    this.company.phones = phones;
    this.phonesIsDirty = true;
  };
  updateTags = (tags: Tag[]) => {
    this.company.tags = tags;
    this.tagsIsDirty = true;
  };

  constructor(
    private companyService: CompanyService,
    private contactService: ContactService,
    private campaignService: CampaignService,
    private actionService: ActionService,
    private route: ActivatedRoute,
    private router: Router,
    private companyUrlTypeService: CompanyUrlTypeService,
    private companyPhoneTypeService: CompanyPhoneTypeService,
    private companyClassificationTypeService: CompanyClassificationTypeService,
    private companyAddressClassificationTypeService: CompanyAddressClassificationTypeService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getCompany();
    this.getCompanyUrlTypes();
    this.getCompanyPhoneTypes();
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

  getCompany(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.companyService.getCompany(companyId)
        .subscribe(company => {
          this.company = company;
          this.company.tags = _.sortBy(this.company.tags, ['name']);
        });
    } else {
      this.company = new Company();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
    }
  }

  addUpdateCompany() {
    const companyId = this.company.companyId;
    if (companyId) {
      this.companyService.updateCompany(this.company).subscribe(result => {
        this.showAssocationSuccessful('company');
        // getting fresh data to make sure updates are working
        this.getCompany();
      });
    } else {
      if (this.entity && this.entityId) {
        this.addCompanyAndAssociation(this.company, this.entity, this.entityId);
      } else {
        this.companyService.addCompany(this.company).subscribe(
          response => this.updateRoute(response.headers.get('Location')));
      }
    }
  }

  completeAssociation(location: string, entity: string, entityId: string) {
    const locattionNodes = _.split(location, '/');
    const newId = _.last(locattionNodes);
    if (entity === 'action') {
      this.actionService.getAction(entityId).toPromise().then(
        action => this.companyService.addActionToCompany(newId, action).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if (entity === 'contact') {
      this.contactService.getContact(entityId).toPromise().then(
        contact => this.companyService.addContactToCompany(newId, contact).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if (entity === 'campaign') {
      this.campaignService.getCampaign(entityId).toPromise().then(
        campaign => this.companyService.addCampaignToCompany(newId, campaign).subscribe(
          response => this.updateRoute(location)
        )
      );
    }
  }

  addCompanyAndAssociation(company: Company, entity: string, entityId: string) {
    const simpleHeaders = {responseType: 'text', observe: 'response'};
    this.companyService.addCompany(company).toPromise().then(
      response => this.completeAssociation(response.headers.get('Location'), entity, entityId)
    );
  }

  updateRoute(location: string) {
    const locattionNodes = _.split(location, '/');
    const newId = _.last(locattionNodes);
    this.router.navigateByUrl(`/company/${newId}`);
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

  /** types **/
  getCompanyPhoneTypes(): void {
    this.companyPhoneTypeService.getPhoneTypeList()
      .subscribe(phoneTypes => this.phoneTypes = phoneTypes);
  }

  onContactAssociatedToEntity(contact: Contact): void {
    if (this.company && contact) {
      this.companyService.addContactToCompany(this.company.companyId, contact)
        .subscribe(response => {
          this.showAssocationSuccessful('contact');
        }, error => {
          this.handleAssociationFailure('contact');
        });
    }
  }

  onContactFlaggedForRemoval(contactId: string) {
    if (this.company && contactId) {
      this.companyService.removeContactFromCompany(this.company.companyId, contactId)
        .subscribe(response => {
          this.showAssocationSuccessful('contact');
        }, error => {
          this.handleAssociationFailure('contact');
        });
    }
  }

  onCampaignAssociatedToEntity(campaign: Campaign): void {
    if (this.company && campaign) {
      this.companyService.addCampaignToCompany(this.company.companyId, campaign)
        .subscribe(response => {
          this.showAssocationSuccessful('campaign');
        }, error => {
          this.handleAssociationFailure('campaign');
        });
    }
  }

  onCampaignFlaggedForRemoval(campaignId: string) {
    if (this.company && campaignId) {
      this.companyService.removeCampaignFromCompany(this.company.companyId, campaignId)
        .subscribe(response => {
          this.showAssocationSuccessful('campaign');
        }, error => {
          this.handleAssociationFailure('campaign');
        });
    }
  }

  onActionAssociatedToEntity(action: Action): void {
    if (this.company && action) {
      this.companyService.addActionToCompany(this.company.companyId, action)
        .subscribe(response => {
          this.showAssocationSuccessful('action');
        }, error => {
          this.handleAssociationFailure('action');
        });
    }
  }

  onActionFlaggedForRemoval(actionId: string) {
    if (this.company && actionId) {
      this.companyService.removeActionFromCompany(this.company.companyId, actionId)
        .subscribe(response => {
          this.showAssocationSuccessful('action');
        }, error => {
          this.handleAssociationFailure('action');
        });
    }
  }

  addressesChanged(addresses: Address[]): void {
    this.addressIsDirty = true;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleAssociationFailure(entity: string, response?: any): void {
    if (entity === 'campaign') {
      this.campaignFailureFlag = true;
    } else if (entity === 'contact') {
      this.contactFailureFlag = true;
    } else if (entity === 'action') {
      this.actionFailureFlag = true;
    } else if (entity === 'company') {
      this.companyFailureUpdated = true;
    }
    this.waitAndReset(entity);
  }

  showAssocationSuccessful(entity: string, response?: any): void {
    if (entity === 'company') {
      this.companyUpdated = true;
      this.addressCard.writeCopyFromOriginal();
    } else if (entity === 'campaign') {
      this.campaignFlag = true;
    } else if (entity === 'contact') {
      this.contactFlag = true;
    } else if (entity === 'action') {
      this.actionFlag = true;
    }
    this.waitAndReset(entity);
  }

  waitAndReset(entity: string): void {
    this.delay(4000).then(resolve => {
        if (entity === 'company') {
          this.companyUpdated = false;
          this.companyFailureUpdated = false;
        } else if (entity === 'campaign') {
          this.campaignFlag = false;
          this.campaignFailureFlag = false;
        } else if (entity === 'contact') {
          this.contactFlag = false;
          this.contactFailureFlag = false;
        } else if (entity === 'action') {
          this.actionFlag = false;
          this.actionFailureFlag = false;
        }
      }
    );
  }

}
