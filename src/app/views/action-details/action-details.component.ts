import {Component, ViewChild, OnInit, AfterViewInit, QueryList, ViewChildren} from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import {Action} from '../../classes/action';
import {ActionClassificationOtherType} from '../../classes/types/action-classification-other-type';
import {ScopeType} from '../../classes/types/scope-type';
import {Company} from '../../classes/company';
import {Contact} from '../../classes/contact';
import {Campaign} from '../../classes/campaign';

import {Tag} from '../../classes/common/tag';
import {BaseViewComponent} from '../../components/base/base-view/base-view.component';
import {SimpleDateTimePickerComponent} from '../../components/widgets/simple-date-time-picker/simple-date-time-picker.component';
import {SimpleSliderComponent} from '../../components/widgets/simple-slider/simple-slider.component';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.css']
})

export class ActionDetailsComponent extends BaseViewComponent implements OnInit, AfterViewInit  {

  @ViewChild(SimpleDateTimePickerComponent) simpleDateTimePicker: SimpleDateTimePickerComponent;
  @ViewChildren(SimpleSliderComponent) sliders: QueryList<SimpleSliderComponent>;

  action: Action = new Action();

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
    this.entityFormGroup = new FormGroup( {});
    this.entityName = 'action';
    window.scrollTo(0, 0);

    this.createForm();

    this.getAction();
    this.loadTeams();
    this.loadTypes();
  }

  ngAfterViewInit() {
    this.entityFormGroup.addControl('pickerForm', this.simpleDateTimePicker.pickerForm);
    this.simpleDateTimePicker.pickerForm.setParent(this.entityFormGroup);

    this.sliders.toArray().map( slider => {
      this.entityFormGroup.addControl('pickerForm ' + slider.aLabel, slider.sliderForm);
      slider.sliderForm.setParent(this.entityFormGroup);
    });

  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.getAction();
  };

  createForm = () => {
    if (!this.action.classificationOtherType) { this.action.classificationOtherType = new ActionClassificationOtherType(); }
    this.entityFormGroup.addControl( 'actionName', new FormControl(this.action.name, [Validators.required]) );
    this.entityFormGroup.addControl( 'actionDescription', new FormControl(this.action.description, [Validators.required]), );
    this.entityFormGroup.addControl( 'actionClassificationTypeId',
      new FormControl(this.action.classificationType.actionClassificationTypeId, [Validators.required]) );
    this.entityFormGroup.addControl( 'actionClassificationOtherTypeId',
      new FormControl(this.action.classificationOtherType.actionClassificationOtherTypeId, [Validators.required]) );
    this.entityFormGroup.addControl( 'scopeTypeId', new FormControl(this.action.scopeType.scopeTypeId, [Validators.required]) );
    this.entityFormGroup.addControl( 'activeAction', new FormControl(this.action.active) );
    this.entityFormGroup.addControl( 'actualCompletionDate', new FormControl(this.action.actualCompletionDate, [Validators.required]) );
    this.entityFormGroup.addControl( 'teamId', new FormControl(this.action.teamId, [Validators.required]) );

    this.disableOther();
    this.disableTeam();
    this.disableCompletionDate();
  };

  get actionName() { return this.entityFormGroup.get('actionName'); }
  get actionDescription() { return this.entityFormGroup.get('actionDescription'); }
  get actionClassificationTypeId() { return this.entityFormGroup.get('actionClassificationTypeId'); }
  get actionClassificationOtherTypeId() { return this.entityFormGroup.get('actionClassificationOtherTypeId'); }
  get scopeTypeId() { return this.entityFormGroup.get('scopeTypeId'); }
  get activeAction() { return this.entityFormGroup.get('activeAction'); }
  get teamId() { return this.entityFormGroup.get('teamId'); }
  get actualCompletionDate() { return this.entityFormGroup.get('actualCompletionDate'); }

  copyFormToAction = () => {
    if ( this.actionClassificationTypeId.value !== 'OT' ) {
      this.actionClassificationOtherTypeId.setValue({value: null} );
    }
    this.action.name = this.actionName.value;
    this.action.description = this.actionDescription.value;
    this.action.active = this.activeAction.value;
    this.action.teamId = this.teamId.value;
    this.action.actualCompletionDate = this.actualCompletionDate.value;
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
    const disableCompletionDate = this.activeAction.value;
    if ( disableCompletionDate ) {
      this.actualCompletionDate.setValue(null );
      this.actualCompletionDate.disable();
    } else {
      this.actualCompletionDate.enable();
    }
  };


  getAction(): void {
    this.actionId = this.route.snapshot.paramMap.get('id');
    if (this.actionId) {
      console.log('actionId ' + this.actionId);
      this.actionService.getAction(this.actionId)
        .subscribe(action => {
          this.action = action;
          this.entityFormGroup.patchValue({
            'actionName': this.action.name,
            'actionDescription': this.action.name,

            'actionClassificationTypeId': this.action.classificationType.actionClassificationTypeId ?
              this.action.classificationType.actionClassificationTypeId : 'GA',

            'actionClassificationOtherTypeId': this.action.classificationOtherType ?
              this.action.classificationOtherType.actionClassificationOtherTypeId : null,

            'scopeTypeId': this.action.scopeType.scopeTypeId ?
              this.action.scopeType.scopeTypeId : 'PR',


            'activeAction': this.action.active,
            'actualCompletionDate': this.action.actualCompletionDate,
            'teamId': this.action.teamId
            });
            this.disableOther();
            this.disableTeam();
            this.disableCompletionDate();
        });
    } else {
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
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
      this.action.ownerId = this.resourceId;
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
      const p1 = this.actionClassificationTypeService.getActionClassificationTypeList();
      p1.subscribe(results => this.classificationTypes = results);
      const p2 = this.actionClassificationOtherTypeService.getActionClassificationOtherTypeList();
      p2.subscribe(results => this.classificationOtherTypes = results);
      const p3 = this.scopeTypeService.getScopeTypeList();
      p3.subscribe(results => this.scopeTypes = results);
      this.typesPromise = Promise.all([p1.toPromise(), p1.toPromise(), p1.toPromise()]).then( result => {
        console.log('all types loaded');
        this.typesPromise = null;
      });
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

  updateDifficulty = (val: number) => {
    console.log('setting difficulty to ' + val);
    this.action.difficulty = val;
  }

  updateImportance = (val: number) => {
    console.log('setting importance to ' + val);
    this.action.importance = val;
  }

}
