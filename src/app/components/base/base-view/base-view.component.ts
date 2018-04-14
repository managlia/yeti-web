import {Component, OnInit, Renderer2, ViewContainerRef, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';

import {EntityService} from '../../../services/entity.service';
import {CompanyOrContactService} from '../../../services/company-or-contact.service';
import * as label from '../../labels';
import {ContactService} from '../../../services/contact.service';
import {CompanyPhoneTypeService} from '../../../services/company-phone-type.service';
import {CampaignService} from '../../../services/campaign.service';
import {CompanyAddressClassificationTypeService} from '../../../services/company-address-classification-type.service';
import {CompanyUrlTypeService} from '../../../services/company-url-type.service';
import {CompanyService} from '../../../services/company.service';
import {CompanyClassificationTypeService} from '../../../services/company-classification-type.service';
import {ActionService} from '../../../services/action.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Company} from '../../../classes/company';
import {EntityClassificationType} from '../../../classes/types/entity-classification-type';
import {PhoneType} from '../../../classes/types/phone-type';
import {AddressClassificationType} from '../../../classes/types/address-classification-type';
import {UrlType} from '../../../classes/types/url-type';
import {ScopeTypeService} from '../../../services/scope-type.service';
import {DataStore} from '../../../classes/data-store';
import {EmailService} from '../../../services/email.service';
import {ActionClassificationTypeService} from '../../../services/action-classification-type.service';
import {ActionClassificationOtherTypeService} from '../../../services/action-classification-other-type.service';
import {Observable} from 'rxjs/Observable';
import {ActionClassificationOtherType} from '../../../classes/types/action-classification-other-type';
import {CampaignClassificationTypeService} from '../../../services/campaign-classification-type.service';

@Component({
  selector: 'app-base-view',
  templateUrl: './base-view.component.html',
  styleUrls: ['./base-view.component.scss']
})
export class BaseViewComponent implements OnInit {

  entityName = 'OverrideInTheViewDetails';
  entityFormGroup: FormGroup;
  entityLoaded = false;

  public dirtyCardColor = 'deeppink';
  bgColor = 'black';
  highlightColor = 'rebeccapurple';
  public readonly label = label;

  actionFlag = false;
  contactFlag = false;
  campaignFlag = false;
  companyFlag = false;

  actionFailureFlag = false;
  companyFailureFlag = false;
  contactFailureFlag = false;
  campaignFailureFlag = false;

  addressIsDirty = false;
  urlsIsDirty = false;
  phonesIsDirty = false;
  tagsIsDirty = false;
  attachmentsIsDirty = false;

  urlTypes: UrlType[];
  phoneTypes: PhoneType[];
  classificationTypes: any[];
  addressClassificationTypes: AddressClassificationType[];
  classificationOtherTypes: ActionClassificationOtherType[];

  entity: string;
  entityId: string;

  constructor(
    public actionService: ActionService,
    public campaignService: CampaignService,
    public companyService: CompanyService,
    public contactService: ContactService,
    public companyOrContactService: CompanyOrContactService,

    public emailService: EmailService,

    public route: ActivatedRoute,
    public router: Router,
    public location: Location,
    public renderer: Renderer2,
    public entityService: EntityService,

    public companyUrlTypeService: CompanyUrlTypeService,
    public companyPhoneTypeService: CompanyPhoneTypeService,
    public companyClassificationTypeService: CompanyClassificationTypeService,
    public companyAddressClassificationTypeService: CompanyAddressClassificationTypeService,
    public formBuilder: FormBuilder,

    public dataStore: DataStore,
    public actionClassificationTypeService: ActionClassificationTypeService,
    public actionClassificationOtherTypeService: ActionClassificationOtherTypeService,
    public scopeTypeService: ScopeTypeService,

    public campaignClassificationTypeService: CampaignClassificationTypeService

  ) {
  }

  ngOnInit() {
  }

  onConsideringEntity($event, thediv): void {
    const target = event.srcElement;
    this.renderer.setStyle(target, 'color', this.highlightColor);
    this.renderer.setStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringEntity($event, thediv): void {
    const target = event.srcElement;
    this.renderer.setStyle(target, 'color', this.bgColor);
  }

  updateRoute(location: string) {
    const locattionNodes = _.split(location, '/');
    const newId = _.last(locattionNodes);
    this.router.navigateByUrl(`/${this.entityName}/${newId}`);
    this.showAssocationSuccessful(this.entityName);
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
      this.companyFailureFlag = true;
    }
    this.waitAndReset(entity);
  }

  showAssocationSuccessful(entity: string, response?: any): void {
    if (entity === 'company') {
      this.companyFlag = true;
    } else if (entity === 'campaign') {
      this.campaignFlag = true;
    } else if (entity === 'contact') {
      this.contactFlag = true;
    } else if (entity === 'action') {
      this.actionFlag = true;
    }
    this.resetTheDirty();
    this.waitAndReset(entity);
  }

  waitAndReset(entity: string): void {
    this.delay(4000).then(resolve => {
        if (entity === 'company') {
          this.companyFlag = false;
          this.companyFailureFlag = false;
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

  orderCompanyContents(company: Company): Company {
    company.tags = _.sortBy(company.tags, ['name']);
    return company;
  }

  readyToSave(): boolean {
    const cardChanged = this.addressIsDirty || this.urlsIsDirty ||  this.phonesIsDirty
          || this.tagsIsDirty || this.attachmentsIsDirty || this.entityFormGroup.dirty;
    // console.log( '                   ==>>>> ' );
    // console.log( 'addressIsDirty     ==>>>> ', this.addressIsDirty );
    // console.log( 'urlsIsDirty        ==>>>> ', this.urlsIsDirty );
    // console.log( 'phonesIsDirty      ==>>>> ', this.phonesIsDirty );
    // console.log( 'tagsIsDirty        ==>>>> ', this.tagsIsDirty );
    // console.log( 'attachmentsIsDirty ==>>>> ', this.attachmentsIsDirty );
    // console.log( 'readyToSave        ==>>>> ', (cardChanged && this.entityFormGroup.valid) );
    // console.log( 'cardChanged        ==>>>> ', (cardChanged) );
    // console.log( 'entityFormGroup    ==>>>> ', (this.entityFormGroup.valid) );
    // console.log( '                   ==>>>> ' );
    return (cardChanged && this.entityFormGroup.valid);
  }

  resetTheDirty = () => {
    this.addressIsDirty = false;
    this.urlsIsDirty = false;
    this.phonesIsDirty = false;
    this.tagsIsDirty = false;
    this.attachmentsIsDirty = false;
  };

  readyToSaveColor = () => {
      if ( this.readyToSave() ) {
      return this.dirtyCardColor;
    } else {
      return '#f0f3f5';
    }
  };

  unreadyToSave(): boolean {
    return !this.readyToSave();
  }
}
