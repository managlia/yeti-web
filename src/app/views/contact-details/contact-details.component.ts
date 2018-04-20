import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as _ from 'lodash';

import {Action} from '../../classes/action';
import {Campaign} from '../../classes/campaign';
import {Contact} from '../../classes/contact';
import {EntityClassificationType} from '../../classes/types/entity-classification-type';

import {Address} from '../../classes/common/address';
import {Url} from '../../classes/common/url';
import {Phone} from '../../classes/common/phone';
import {Tag} from '../../classes/common/tag';
import {BaseViewComponent} from '../../components/base/base-view/base-view.component';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent extends BaseViewComponent implements OnInit {

  contact: Contact;

  updateLinks = (urls: Url[]) => {
    this.contact.urls = urls;
    this.urlsIsDirty = true;
  };
  updatePhones = (phones: Phone[]) => {
    this.contact.phones = phones;
    this.phonesIsDirty = true;
  };
  updateTags = (tags: Tag[]) => {
    this.contact.tags = tags;
    this.tagsIsDirty = true;
  };
  addressesChanged = (addresses: Address[]) => {
    this.addressIsDirty = true;
  };

  ngOnInit() {
    this.entityName = 'contact';
    window.scrollTo(0, 0);
    this.getContact();
    this.loadTypes();
  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.getContact();
  };

  selectCompany = () => this.router.navigateByUrl( `/company/${this.contact.companyId}` );

  createForm() {
    if (!this.contact.classificationType) { this.contact.classificationType = new EntityClassificationType(); }
    this.entityFormGroup = this.formBuilder.group({ // <-- the parent FormGroup
      contactFirstName: new FormControl(this.contact.firstName, [Validators.required]),
      contactLastName: new FormControl(this.contact.lastName, [Validators.required]),
      classificationTypeId: new FormControl(
        this.contact.classificationType.classificationTypeId, [Validators.required]),
      contactEmailAddress: new FormControl(this.contact.contactEmailAddress, this.emailValidator()),
      description:  new FormControl(this.contact.description, [Validators.required]),
      contactTitleTypeId: new FormControl(this.contact.titleType.contactTitleTypeId),
      dob:  new FormControl(this.contact.dob),
    });
    this.entityLoaded = true;
  }

  get contactFirstName() { return this.entityFormGroup.get('contactFirstName'); }
  get contactLastName() { return this.entityFormGroup.get('contactLastName'); }
  get classificationTypeId() { return this.entityFormGroup.get('classificationTypeId'); }
  get contactEmailAddress() { return this.entityFormGroup.get('contactEmailAddress'); }
  get description() { return this.entityFormGroup.get('description'); }
  get contactTitleTypeId() { return this.entityFormGroup.get('contactTitleTypeId'); }
  get dob() { return this.entityFormGroup.get('dob'); }

  copyFormToContact = () => {

    this.contact.firstName = this.contactFirstName.value;
    this.contact.lastName = this.contactLastName.value;
    this.contact.description = this.description.value;
    this.contact.contactEmailAddress = this.contactEmailAddress.value;
    this.contact.dob = this.dob.value;
    this.contact.classificationType = this.classificationTypes.filter(
      e => e.classificationTypeId === this.classificationTypeId.value)[0];
    this.contact.titleType = this.titleTypes.filter(
      e => e.contactTitleTypeId === this.contactTitleTypeId.value)[0];
  }

  getContact(): void {
    const contactId = this.route.snapshot.paramMap.get('id');
    if (contactId) {
      this.contactService.getContact(contactId).subscribe(
        contact => {
          this.contact = this.orderContactContents(contact);
          this.createForm();
        });
    } else {
      this.contact = new Contact();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      if ( this.entity && this.entity === 'company' ) {
          this.contact.companyId = this.entityId;
      }
      this.createForm();
    }
  }

  addUpdateContact() {
    const contactId = this.contact.contactId;
    this.copyFormToContact();
    if (contactId) {
      this.contactService.updateContact(this.contact).subscribe(result => {
        this.showAssocationSuccessful('contact');
        // getting fresh data to make sure updates are working
        this.getContact();
      });
    } else {
      if (this.entity && this.entityId) {
        this.contactService.addContact(this.contact).toPromise().then(
          response => this.completeAssociation(response.headers.get('Location'), this.entity, this.entityId) );
      } else {
        this.contactService.addContact(this.contact).subscribe(
          response => this.updateRoute(response.headers.get('Location')));
      }
    }
  }

  completeAssociation(location: string, entity: string, entityId: string) {
    const newId = _.last(_.split(location, '/'));
    if (entity === 'action') {
      this.actionService.getAction(entityId).toPromise().then(
        action => this.contactService.addActionToContact(newId, action).subscribe(
          response => this.updateRoute(location)
        ));
    } else if (entity === 'campaign') {
      this.campaignService.getCampaign(entityId).toPromise().then(
        campaign => this.contactService.addCampaignToContact(newId, campaign).subscribe(
          response => this.updateRoute(location)
        ));
    }
  }

  loadTypes(): void {
    this.contactClassificationTypeService.getContactClassificationTypeList()
      .subscribe(contactTypes => this.classificationTypes = contactTypes);
    this.contactAddressClassificationTypeService.getContactAddressClassificationTypeList()
      .subscribe(addressTypes => this.addressClassificationTypes = addressTypes);
    this.contactUrlTypeService.getUrlTypeList()
      .subscribe(urlTypes => this.urlTypes = urlTypes);
    this.contactPhoneTypeService.getPhoneTypeList()
      .subscribe(phoneTypes => this.phoneTypes = phoneTypes);
    this.contactTitleTypeService.getTitleTypeList()
      .subscribe(titleTypes => this.titleTypes = titleTypes);
  }

  onCompanyChosen(companyId: string) {
    this.contact.companyId = companyId;
    const contactId = this.contact.contactId;
    this.contactService.updateContact(this.contact).subscribe(
      response => this.showAssocationSuccessful('company'),
      error => this.handleAssociationFailure('company'));
  }

  onCampaignAssociatedToEntity(campaign: Campaign): void {
    this.contactService.addCampaignToContact(this.contact.contactId, campaign).subscribe(
      response => this.showAssocationSuccessful('campaign'),
      error => this.handleAssociationFailure('campaign'));
  }

  onCampaignFlaggedForRemoval(campaignId: string) {
    this.contactService.removeCampaignFromContact(this.contact.contactId, campaignId).subscribe(
      response => this.showAssocationSuccessful('campaign'),
      error => this.handleAssociationFailure('campaign'));
  }

  onActionAssociatedToEntity(action: Action): void {
    this.contactService.addActionToContact(this.contact.contactId, action).subscribe(
      response => this.showAssocationSuccessful('action'),
      error => this.handleAssociationFailure('action'));
  }

  onActionFlaggedForRemoval(actionId: string) {
    this.contactService.removeActionFromContact(this.contact.contactId, actionId).subscribe(
      response => this.showAssocationSuccessful('action'),
      error => this.handleAssociationFailure('action'));
  }
}
