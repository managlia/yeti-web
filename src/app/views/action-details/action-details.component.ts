import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';

import {Action} from '../../classes/action';
import {ActionClassificationType} from '../../classes/types/action-classification-type';
import {ActionClassificationOtherType} from '../../classes/types/action-classification-other-type';
import {ScopeType} from '../../classes/types/scope-type';
import {Company} from '../../classes/company';
import {Contact} from '../../classes/contact';
import {Campaign} from '../../classes/campaign';

import {Tag} from '../../classes/common/tag';
import {BaseViewComponent} from '../../components/base/base-view/base-view.component';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.css']
})

export class ActionDetailsComponent extends BaseViewComponent implements OnInit {

  action: Action;

  actionId: string;
  scopeTypes: ScopeType[];
  tagsIsDirty = false;

  entity: string;
  entityId: string;

  updateTags = (tags: Tag[]) => {
    this.action.tags = tags;
    this.tagsIsDirty = true;
  };

  ngOnInit() {
    this.entityName = 'action';
    window.scrollTo(0, 0);
    this.getAction();
    this.loadTypes();
  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.getAction();
  }

  createForm = () => {
    if (!this.action.scopeType) { this.action.scopeType = new ScopeType(); }
    if (!this.action.classificationType) { this.action.classificationType = new ActionClassificationType(); }
    if (!this.action.classificationOtherType) { this.action.classificationOtherType = new ActionClassificationOtherType(); }
    this.entityFormGroup = new FormGroup({
      actionName: new FormControl(this.action.name, [Validators.required]),
      actionDescription: new FormControl(this.action.description, [Validators.required]),
      actionClassificationTypeId: new FormControl(this.action.classificationType.actionClassificationTypeId, [Validators.required]),
      actionClassificationOtherTypeId: new FormControl(this.action.classificationOtherType.actionClassificationOtherTypeId),
      scopeTypeId: new FormControl(this.action.scopeType.scopeTypeId, [Validators.required]),
      targetValuation: new FormControl(this.action.targetValuation),
      actualValuation: new FormControl(this.action.actualValuation)
    });
    this.disableOther();
    this.entityLoaded = true;
  };

  get actionName() { return this.entityFormGroup.get('actionName'); }
  get actionDescription() { return this.entityFormGroup.get('actionDescription'); }
  get actionClassificationTypeId() { return this.entityFormGroup.get('actionClassificationTypeId'); }
  get actionClassificationOtherTypeId() { return this.entityFormGroup.get('actionClassificationOtherTypeId'); }
  get scopeTypeId() { return this.entityFormGroup.get('scopeTypeId'); }
  get targetValuation() { return this.entityFormGroup.get('targetValuation'); }
  get actualValuation() { return this.entityFormGroup.get('actualValuation'); }

  copyFormToAction = () => {
    if ( this.actionClassificationTypeId.value !== 'OT' ) {
      this.actionClassificationOtherTypeId.setValue({value: null} );
    }
    this.action.name = this.actionName.value;
    this.action.description = this.actionDescription.value;
    this.action.targetValuation = this.targetValuation.value;
    this.action.actualValuation = this.actualValuation.value;
    this.action.scopeType = this.scopeTypes.filter(
      e => e.scopeTypeId === this.scopeTypeId.value)[0];
    this.action.classificationType = this.classificationTypes.filter(
      e => e.actionClassificationTypeId === this.actionClassificationTypeId.value)[0];
    this.action.classificationOtherType = this.classificationOtherTypes.filter(
      e => e.actionClassificationOtherTypeId === this.actionClassificationOtherTypeId.value)[0];
  };

  disableOther = () => {
    const disableOther = this.actionClassificationTypeId.value !== 'OT';
    if ( disableOther ) {
      this.actionClassificationOtherTypeId.setValue({value: null} );
      this.actionClassificationOtherTypeId.disable();
    } else {
      this.actionClassificationOtherTypeId.enable();
    }
  };

  getAction(): void {
    this.actionId = this.route.snapshot.paramMap.get('id');
    if (this.actionId) {
      console.log('actionId ' + this.actionId);
      this.actionService.getAction(this.actionId)
        .subscribe(action => {
          this.action = action;
          this.createForm();
        });
    } else {
      this.action = new Action();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      this.createForm();
    }
  }

  addUpdateAction() {
    const actionId = this.action.actionId;
    this.copyFormToAction();
    if (actionId) {
      this.actionService.updateAction(this.action).subscribe(feedback => {
        this.showAssocationSuccessful('action');
        this.getAction();
      });
    } else {
      this.action.ownerId = this.dataStore.userId;
      if (this.entity && this.entityId) {
        this.actionService.addAction(this.action).toPromise()
          .then(response => this.completeAssociation(response.headers.get('Location'), this.entity, this.entityId))
          .then(response => this.getAction());
      } else {
        this.actionService.addAction(this.action).subscribe(response => {
          this.updateRoute(response.headers.get('Location'));
          this.getAction();
        });
      }
    }
  }

  completeAssociation(location: string, entity: string, entityId: string) {
    const newId = _.last(_.split(location, '/'));
    if (entity === 'company') {
      this.companyService.getCompany(entityId).toPromise().then(
        company => this.actionService.addActionToCompany(company, newId).subscribe(
          response => this.updateRoute(location)));
    } else if (entity === 'contact') {
      this.contactService.getContact(entityId).toPromise().then(
        contact => this.actionService.addActionToContact(contact, newId).subscribe(
          response => this.updateRoute(location)));
    } else if (entity === 'campaign') {
      this.campaignService.getCampaign(entityId).toPromise().then(
        campaign => this.actionService.addActionToCampaign(campaign, newId).subscribe(
          response => this.updateRoute(location)));
    }
  }

  loadTypes(): void {
    this.actionClassificationTypeService.getActionClassificationTypeList()
      .subscribe(results => this.classificationTypes = results);
    this.actionClassificationOtherTypeService.getActionClassificationOtherTypeList()
      .subscribe(results => this.classificationOtherTypes = results);
    this.scopeTypeService.getScopeTypeList()
      .subscribe(results => this.scopeTypes = results);
  }

  onCompanyAssociatedToEntity(company: Company) {
    this.actionService.addActionToCompany(company, this.action.actionId).subscribe(
      response => this.showAssocationSuccessful('company'),
      error => this.handleAssociationFailure('company'));
  }

  onCompanyFlaggedForRemoval(companyId: string) {
    this.actionService.removeActionFromCompany(companyId, this.action.actionId).subscribe(
      response => this.showAssocationSuccessful('company'),
      error => this.handleAssociationFailure('company'));
  }

  onContactAssociatedToEntity(contact: Contact): void {
    this.actionService.addActionToContact(contact, this.action.actionId).subscribe(
      response => this.showAssocationSuccessful('contact'),
      error => this.handleAssociationFailure('contact'));
  }

  onContactFlaggedForRemoval(contactId: string) {
    this.actionService.removeActionFromContact(contactId, this.action.actionId).subscribe(
      response => this.showAssocationSuccessful('contact'),
      error => this.handleAssociationFailure('contact'));
  }

  onCampaignAssociatedToEntity(campaign: Campaign): void {
    this.actionService.addActionToCampaign(campaign, this.action.actionId).subscribe(
      response => this.showAssocationSuccessful('campaign'),
      error => this.handleAssociationFailure('campaign'));
  }

  onCampaignFlaggedForRemoval(campaignId: string) {
    this.actionService.removeActionFromCampaign(campaignId, this.action.actionId).subscribe(
      response => this.showAssocationSuccessful('campaign'),
      error => this.handleAssociationFailure('campaign'));
  }
}
