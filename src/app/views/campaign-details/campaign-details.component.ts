import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';

import {Campaign} from '../../classes/campaign';
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
    this.loadTeams();
    this.loadTypes();
  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.getCampaign();
  }

  createForm = () => {
    if (!this.campaign.scopeType.scopeTypeId) {
      this.campaign.scopeType.scopeTypeId = 'PA';
    }
    if (!this.campaign.classificationType.campaignClassificationTypeId) {
      this.campaign.classificationType.campaignClassificationTypeId = '1';
    }
    this.entityFormGroup = new FormGroup({
      campaignName: new FormControl(this.campaign.name, [Validators.required]),
      campaignDescription: new FormControl(this.campaign.description, [Validators.required]),
      campaignClassificationTypeId:
        new FormControl(this.campaign.classificationType.campaignClassificationTypeId, [Validators.required]),
      scopeTypeId: new FormControl(this.campaign.scopeType.scopeTypeId, [Validators.required]),
      activeCampaign: new FormControl(this.campaign.active),
      teamId: new FormControl(this.campaign.teamId, [Validators.required]),
      targetCompletionDate: new FormControl(new Date(this.campaign.targetCompletionDate), [Validators.required]),
      actualCompletionDate: new FormControl('', [Validators.required])
    });
    this.onChanges();
    if ( this.campaign.actualCompletionDate ) {
      this.entityFormGroup.patchValue({
        'actualCompletionDate' : new Date(this.campaign.actualCompletionDate)
     });
    }
    this.disableTeam();
    this.disableCompletionDate();
    this.entityLoaded = true;
  };

  get campaignName() { return this.entityFormGroup.get('campaignName'); }
  get campaignDescription() { return this.entityFormGroup.get('campaignDescription'); }
  get campaignClassificationTypeId() { return this.entityFormGroup.get('campaignClassificationTypeId'); }
  get scopeTypeId() { return this.entityFormGroup.get('scopeTypeId'); }
  get activeCampaign() { return this.entityFormGroup.get('activeCampaign'); }
  get teamId() { return this.entityFormGroup.get('teamId'); }
  get targetCompletionDate() { return this.entityFormGroup.get('targetCompletionDate'); }
  get actualCompletionDate() { return this.entityFormGroup.get('actualCompletionDate'); }

  onChanges = () => {
    this.entityFormGroup.valueChanges.subscribe( val => {
      console.log('==================> ' + JSON.stringify(val));
    });
    this.campaignName.valueChanges.subscribe( val => {
      console.log('start campaignName ' + this.campaignName);
    });
    this.campaignDescription.valueChanges.subscribe( val => {
      console.log('start campaignDescription ' + this.campaignDescription);
    });
    this.campaignClassificationTypeId.valueChanges.subscribe( val => {
      console.log('start campaignClassificationTypeId ' + this.campaignClassificationTypeId);
    });
    this.scopeTypeId.valueChanges.subscribe( val => {
      console.log('start scopeTypeId ' + this.scopeTypeId);
    });
    this.activeCampaign.valueChanges.subscribe( val => {
      console.log('start activeCampaign ' + this.activeCampaign);
    });
    this.teamId.valueChanges.subscribe( val => {
      console.log('start teamId ' + this.teamId);
    });
    this.targetCompletionDate.valueChanges.subscribe( val => {
      console.log('start targetCompletionDate ' + this.targetCompletionDate);
    });
    this.actualCompletionDate.valueChanges.subscribe( val => {
      console.log('start actualCompletionDate ' + this.actualCompletionDate);
    });
  };

  copyFormToCampaign = () => {
    this.campaign.name = this.campaignName.value;
    this.campaign.description = this.campaignDescription.value;
    this.campaign.active = this.activeCampaign.value;
    this.campaign.teamId = this.teamId.value;
    if ( this.targetCompletionDate.value ) {
      const completeDate = new Date(this.targetCompletionDate.value);
      this.campaign.targetCompletionDate =
        moment.tz( completeDate, 'Etc/UTC').format('YYYY-MM-DD HH:mm');
    }
    if ( this.actualCompletionDate.value ) {
      const completeDate = new Date(this.actualCompletionDate.value);
      this.campaign.actualCompletionDate =
        moment.tz( completeDate, 'Etc/UTC').format('YYYY-MM-DD HH:mm');
    }
    this.campaign.scopeType = this.scopeTypes.filter(
      e => e.scopeTypeId === this.scopeTypeId.value)[0];
    this.campaign.classificationType = this.classificationTypes.filter(
      e => e.campaignClassificationTypeId === this.campaignClassificationTypeId.value)[0];
  };

  disableTeam = () => {
    const disableTeam = this.scopeTypeId.value !== 'SH';
    if ( disableTeam ) {
      this.teamId.setValue(null );
      this.teamId.disable();
    } else {
      this.teamId.enable();
    }
  };

  disableCompletionDate = () => {
    const disableCompletionDate = this.activeCampaign.value;
    if ( disableCompletionDate ) {
      this.actualCompletionDate.setValue(null );
      this.actualCompletionDate.disable();
    } else {
      this.actualCompletionDate.enable();
    }
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
      this.campaign.ownerId = this.resourceId;
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
    const p1 = this.campaignClassificationTypeService.getCampaignClassificationTypeList();
    const p2 = this.scopeTypeService.getScopeTypeList();
    // may want to wrap these in a monitor that identifies all complete
    p1.subscribe(results => this.classificationTypes = results);
    p2.subscribe(results => this.scopeTypes = results);
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

  updateDifficulty = (val: number) => {
    this.campaign.difficulty = val;
  }

  updateImportance = (val: number) => {
    this.campaign.importance = val;
  }

}
