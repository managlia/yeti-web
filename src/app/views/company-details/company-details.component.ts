import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as _ from 'lodash';

import {BaseViewComponent} from '../../components/base/base-view/base-view.component';
import {Action} from '../../classes/action';
import {Address} from '../../classes/common/address';
import {Campaign} from '../../classes/campaign';
import {Company} from '../../classes/company';
import {Contact} from '../../classes/contact';
import {Phone} from '../../classes/common/phone';
import {Tag} from '../../classes/common/tag';
import {Url} from '../../classes/common/url';
import {EntityClassificationType} from '../../classes/types/entity-classification-type';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent extends BaseViewComponent implements OnInit {

  company: Company;

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
  addressesChanged = (addresses: Address[]) => {
    this.addressIsDirty = true;
  };

  ngOnInit() {
    this.entityName = 'company';
    window.scrollTo(0, 0);
    this.getCompany();
    this.loadTypes();
  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.getCompany();
  };

  createForm() {
    if (!this.company.classificationType) { this.company.classificationType = new EntityClassificationType(); }
    this.entityFormGroup = this.formBuilder.group({ // <-- the parent FormGroup
      companyName: new FormControl(this.company.name, [Validators.required]),
      classificationTypeId: new FormControl(
        this.company.classificationType.classificationTypeId, [Validators.required]),
      externalId: new FormControl(this.company.externalId, [Validators.required]),
      description:  new FormControl(this.company.description, [Validators.required]),
      activeCompany:  new FormControl(this.company.active)
    });
    this.entityLoaded = true;
  }

  get companyName() { return this.entityFormGroup.get('companyName'); }
  get classificationTypeId() { return this.entityFormGroup.get('classificationTypeId'); }
  get externalId() { return this.entityFormGroup.get('externalId'); }
  get description() { return this.entityFormGroup.get('description'); }
  get activeCompany() { return this.entityFormGroup.get('activeCompany'); }

  copyFormToCompany = () => {
    this.company.name = this.companyName.value;
    this.company.description = this.description.value;
    this.company.externalId = this.externalId.value;
    this.company.active = this.activeCompany.value;
    this.company.classificationType = this.classificationTypes.filter(
      e => e.classificationTypeId === this.classificationTypeId.value)[0];
  }

  getCompany(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.companyService.getCompany(companyId).subscribe(
        company => {
          this.company = this.orderCompanyContents(company);
          this.createForm();
      });
    } else {
      this.company = new Company();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      this.createForm();
    }
  }

  addUpdateCompany() {
    const companyId = this.company.companyId;
    this.copyFormToCompany();
    if (companyId) {
      this.companyService.updateCompany(this.company).subscribe(result => {
        this.showAssocationSuccessful('company');
        // getting fresh data to make sure updates are working
        this.getCompany();
      });
    } else {
      if (this.entity && this.entityId) {
        this.companyService.addCompany(this.company).toPromise().then(
          response => this.completeAssociation(response.headers.get('Location'), this.entity, this.entityId) );
      } else {
        this.companyService.addCompany(this.company).subscribe(
          response => this.updateRoute(response.headers.get('Location')));
      }
    }
  }

  completeAssociation(location: string, entity: string, entityId: string) {
    const newId = _.last(_.split(location, '/'));
    if (entity === 'action') {
      this.actionService.getAction(entityId).toPromise().then(
        action => this.companyService.addActionToCompany(newId, action).subscribe(
          response => this.updateRoute(location)
      ));
    } else if (entity === 'contact') {
      this.contactService.getContact(entityId).toPromise().then(
        contact => this.companyService.addContactToCompany(newId, contact).subscribe(
          response => this.updateRoute(location)
      ));
    } else if (entity === 'campaign') {
      this.campaignService.getCampaign(entityId).toPromise().then(
        campaign => this.companyService.addCampaignToCompany(newId, campaign).subscribe(
          response => this.updateRoute(location)
      ));
    }
  }

  loadTypes(): void {
    this.companyClassificationTypeService.getCompanyClassificationTypeList()
      .subscribe(companyTypes => this.classificationTypes = companyTypes);
    this.companyAddressClassificationTypeService.getCompanyAddressClassificationTypeList()
      .subscribe(addressTypes => this.addressClassificationTypes = addressTypes);
    this.companyUrlTypeService.getUrlTypeList()
      .subscribe(urlTypes => this.urlTypes = urlTypes);
    this.companyPhoneTypeService.getPhoneTypeList()
      .subscribe(phoneTypes => this.phoneTypes = phoneTypes);
  }

  onContactAssociatedToEntity(contact: Contact): void {
      this.companyService.addContactToCompany(this.company.companyId, contact).subscribe(
        response => this.showAssocationSuccessful('contact'),
          error => this.handleAssociationFailure('contact'));
  }

  onContactFlaggedForRemoval(contactId: string) {
      this.companyService.removeContactFromCompany(this.company.companyId, contactId).subscribe(
        response => this.showAssocationSuccessful('contact'),
        error => this.handleAssociationFailure('contact'));
  }

  onCampaignAssociatedToEntity(campaign: Campaign): void {
      this.companyService.addCampaignToCompany(this.company.companyId, campaign).subscribe(
        response => this.showAssocationSuccessful('campaign'),
        error => this.handleAssociationFailure('campaign'));
  }

  onCampaignFlaggedForRemoval(campaignId: string) {
      this.companyService.removeCampaignFromCompany(this.company.companyId, campaignId).subscribe(
        response => this.showAssocationSuccessful('campaign'),
        error => this.handleAssociationFailure('campaign'));
  }

  onActionAssociatedToEntity(action: Action): void {
      this.companyService.addActionToCompany(this.company.companyId, action).subscribe(
        response => this.showAssocationSuccessful('action'),
        error => this.handleAssociationFailure('action'));
  }

  onActionFlaggedForRemoval(actionId: string) {
      this.companyService.removeActionFromCompany(this.company.companyId, actionId).subscribe(
        response => this.showAssocationSuccessful('action'),
        error => this.handleAssociationFailure('action'));
  }

  onChatter = () => {
    console.log('how about a little chatter ****NOW*** ?');
    const data = {
      entityType: 'company',
      entity: this.company
    };
    const x = this.chatterService.openDialog(data);
  }
}
