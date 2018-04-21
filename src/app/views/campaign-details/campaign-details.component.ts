import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';

import {Campaign} from '../../classes/campaign';
import {CampaignClassificationType} from '../../classes/types/campaign-classification-type';
import {ScopeType} from '../../classes/types/scope-type';
import {Company} from '../../classes/company';
import {Contact} from '../../classes/contact';
import {Action} from '../../classes/action';

import {Tag} from '../../classes/common/tag';
import {BaseViewComponent} from '../../components/base/base-view/base-view.component';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})

export class CampaignDetailsComponent extends BaseViewComponent implements OnInit {

  campaign: Campaign;

  campaignId: string;
  scopeTypes: ScopeType[];
  tagsIsDirty = false;

  entity: string;
  entityId: string;

  updateTags = (tags: Tag[]) => {
    this.campaign.tags = tags;
    this.tagsIsDirty = true;
  };

  ngOnInit() {
    this.entityName = 'campaign';
    window.scrollTo(0, 0);
    this.getCampaign();
    this.loadTypes();
  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.getCampaign();
  }

  createForm = () => {
    if (!this.campaign.scopeType) { this.campaign.scopeType = new ScopeType(); }
    if (!this.campaign.classificationType) { this.campaign.classificationType = new CampaignClassificationType(); }
    this.entityFormGroup = new FormGroup({
      campaignName: new FormControl(this.campaign.name, [Validators.required]),
      campaignDescription: new FormControl(this.campaign.description, [Validators.required]),
      campaignClassificationTypeId: new FormControl(this.campaign.classificationType.campaignClassificationTypeId, [Validators.required]),
      scopeTypeId: new FormControl(this.campaign.scopeType.scopeTypeId, [Validators.required]),
      targetValuation: new FormControl(this.campaign.targetValuation),
      actualValuation: new FormControl(this.campaign.actualValuation),
      activeCampaign: new FormControl(this.campaign.active),
    });
    this.entityLoaded = true;
  };

  get campaignName() { return this.entityFormGroup.get('campaignName'); }
  get campaignDescription() { return this.entityFormGroup.get('campaignDescription'); }
  get campaignClassificationTypeId() { return this.entityFormGroup.get('campaignClassificationTypeId'); }
  get scopeTypeId() { return this.entityFormGroup.get('scopeTypeId'); }
  get targetValuation() { return this.entityFormGroup.get('targetValuation'); }
  get actualValuation() { return this.entityFormGroup.get('actualValuation'); }
  get activeCampaign() { return this.entityFormGroup.get('activeCampaign'); }

  copyFormToCampaign = () => {
    this.campaign.name = this.campaignName.value;
    this.campaign.description = this.campaignDescription.value;
    this.campaign.targetValuation = this.targetValuation.value;
    this.campaign.actualValuation = this.actualValuation.value;
    this.campaign.active = this.activeCampaign.value;
    this.campaign.scopeType = this.scopeTypes.filter(
      e => e.scopeTypeId === this.scopeTypeId.value)[0];
    this.campaign.classificationType = this.classificationTypes.filter(
      e => e.campaignClassificationTypeId === this.campaignClassificationTypeId.value)[0];
  };

  getCampaign(): void {
    this.campaignId = this.route.snapshot.paramMap.get('id');
    if (this.campaignId) {
      console.log('campaignId ' + this.campaignId);
      this.campaignService.getCampaign(this.campaignId)
        .subscribe(campaign => {
          this.campaign = campaign;
          this.createForm();
        });
    } else {
      this.campaign = new Campaign();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      this.createForm();
    }
  }

  addUpdateCampaign() {
    const campaignId = this.campaign.campaignId;
    this.copyFormToCampaign();
    if (campaignId) {
      this.campaignService.updateCampaign(this.campaign).subscribe(feedback => {
        this.showAssocationSuccessful('campaign');
        this.getCampaign();
      });
    } else {
      this.campaign.ownerId = this.dataStore.userId;
      if (this.entity && this.entityId) {
        this.campaignService.addCampaign(this.campaign).toPromise()
          .then(response => this.completeAssociation(response.headers.get('Location'), this.entity, this.entityId))
          .then(response => this.getCampaign());
      } else {
        this.campaignService.addCampaign(this.campaign).subscribe(response => {
          this.updateRoute(response.headers.get('Location'));
          this.getCampaign();
        });
      }
    }
  }

  completeAssociation(location: string, entity: string, entityId: string) {
    const newId = _.last(_.split(location, '/'));
    if (entity === 'company') {
      this.companyService.getCompany(entityId).toPromise().then(
        company => this.campaignService.addCampaignToCompany(company, newId).subscribe(
          response => this.updateRoute(location)));
    } else if (entity === 'contact') {
      this.contactService.getContact(entityId).toPromise().then(
        contact => this.campaignService.addCampaignToContact(contact, newId).subscribe(
          response => this.updateRoute(location)));
    } else if (entity === 'action') {
      this.actionService.getAction(entityId).toPromise().then(
        action => this.campaignService.addCampaignToAction(action, newId).subscribe(
          response => this.updateRoute(location)));
    }
  }

  loadTypes(): void {
    this.campaignClassificationTypeService.getCampaignClassificationTypeList()
      .subscribe(results => this.classificationTypes = results);
    this.scopeTypeService.getScopeTypeList()
      .subscribe(results => this.scopeTypes = results);
  }

  onCompanyAssociatedToEntity(company: Company) {
    this.campaignService.addCampaignToCompany(company, this.campaign.campaignId).subscribe(
      response => this.showAssocationSuccessful('company'),
      error => this.handleAssociationFailure('company'));
  }

  onCompanyFlaggedForRemoval(companyId: string) {
    this.campaignService.removeCampaignFromCompany(companyId, this.campaign.campaignId).subscribe(
      response => this.showAssocationSuccessful('company'),
      error => this.handleAssociationFailure('company'));
  }

  onContactAssociatedToEntity(contact: Contact): void {
    this.campaignService.addCampaignToContact(contact, this.campaign.campaignId).subscribe(
      response => this.showAssocationSuccessful('contact'),
      error => this.handleAssociationFailure('contact'));
  }

  onContactFlaggedForRemoval(contactId: string) {
    this.campaignService.removeCampaignFromContact(contactId, this.campaign.campaignId).subscribe(
      response => this.showAssocationSuccessful('contact'),
      error => this.handleAssociationFailure('contact'));
  }

  onActionAssociatedToEntity(action: Action): void {
    this.campaignService.addCampaignToAction(action, this.campaign.campaignId).subscribe(
      response => this.showAssocationSuccessful('action'),
      error => this.handleAssociationFailure('action'));
  }

  onActionFlaggedForRemoval(actionId: string) {
    this.campaignService.removeCampaignFromAction(actionId, this.campaign.campaignId).subscribe(
      response => this.showAssocationSuccessful('action'),
      error => this.handleAssociationFailure('action'));
  }
}
