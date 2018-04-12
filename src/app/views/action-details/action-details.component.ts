import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';

import { DataStore } from '../../classes/data-store';
import { CompanyService } from '../../services/company.service';
import { ContactService } from '../../services/contact.service';
import { CampaignService } from '../../services/campaign.service';
import { ActionService } from '../../services/action.service';
import { EmailService } from '../../services/email.service';
import { ActionClassificationTypeService } from '../../services/action-classification-type.service';
import { ActionClassificationOtherTypeService } from '../../services/action-classification-other-type.service';
import { Action } from '../../classes/action';
import { Email } from '../../classes/email';
import { ActionClassificationType } from '../../classes/types/action-classification-type';
import { ActionClassificationOtherType } from '../../classes/types/action-classification-other-type';
import {Observable} from 'rxjs/Observable';
import { ScopeType } from '../../classes/types/scope-type';
import {Company} from '../../classes/company';
import {Contact} from '../../classes/contact';
import {Campaign} from '../../classes/campaign';
import {ScopeTypeService} from '../../services/scope-type.service';
import {HttpResponse} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {Tag} from '../../classes/common/tag';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.css']
})

export class ActionDetailsComponent implements OnInit {
  @Input() action: Action;
  actionUpdated = false;
  actionFailureUpdated = false;
  companyFlag = false;
  contactFlag = false;
  campaignFlag = false;
  companyFailureFlag = false;
  contactFailureFlag = false;
  campaignFailureFlag = false;
  actionId: string;
  classificationTypes: Observable<ActionClassificationType[]>;
  classificationOtherTypes: Observable<ActionClassificationOtherType[]>;
  scopeTypes: ScopeType[];
  tagsIsDirty = false;

  entity: string;
  entityId: string;

  constructor(
    private dataStore: DataStore,
    private companyService: CompanyService,
    private contactService: ContactService,
    private campaignService: CampaignService,
    public actionService: ActionService,
    public route: ActivatedRoute,
    private router: Router,
    private actionClassificationTypeService: ActionClassificationTypeService,
    private actionClassificationOtherTypeService: ActionClassificationOtherTypeService,
    private scopeTypeService: ScopeTypeService,
    public formBuilder: FormBuilder,
    public emailService: EmailService
  ) {
    this.classificationTypes = this.actionClassificationTypeService.getActionClassificationTypeList();
    this.classificationOtherTypes = this.actionClassificationOtherTypeService.getActionClassificationOtherTypeList();
    this.getScopeTypes();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getActionById();
  }

  getActionById(): void {
    this.actionId = this.route.snapshot.paramMap.get('id');
    if ( this.actionId ) {
      console.log('actionId ' + this.actionId);
      this.actionService.getAction(this.actionId)
        .subscribe(action => {
          this.action = action;
          this.action.scopeType ? console.log('skipa') : this.action.scopeType = new ScopeType();
          this.action.classificationType ? console.log('skipb') : this.action.classificationType = new ActionClassificationType();
        });
    } else {
      this.action = new Action();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      if ( this.entity ) {
        if ( this.entity === 'company' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'contact' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'campaign' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        }
      }
    }
  }

  /** add update action **/
  addUpdateAction() {
    const actionId = this.action.actionId;
    if ( actionId ) {
      console.log(`This is an update because action id is ${actionId}`);
      this.actionService.updateAction(this.action).subscribe(feedback => this.showAssocationSuccessful('action'));
    } else {
      console.log(`This is an ADD because action id is ${actionId}`);
      this.action.ownerId = this.dataStore.userId;
      if ( this.entity && this.entityId ) {
        this.addActionAndAssociation(this.action, this.entity, this.entityId);
      } else {
        this.actionService.addAction(this.action).subscribe(
          response => this.updateRoute(response.headers.get('Location')) );
      }
    }
  }

  completeAssociation( location: string, entity: string, entityId: string ) {
    const locattionNodes = _.split( location, '/' );
    const newId = _.last(locattionNodes);
    if ( entity === 'company' ) {
      this.companyService.getCompany(entityId).toPromise().then(
        company => this.actionService.addActionToCompany( company, newId ).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if ( entity === 'contact' ) {
      this.contactService.getContact(entityId).toPromise().then(
        contact => this.actionService.addActionToContact( contact, newId ).subscribe(
          response => this.updateRoute(location)
        )
      );
    } else if ( entity === 'campaign' ) {
      this.campaignService.getCampaign(entityId).toPromise().then(
        campaign => this.actionService.addActionToCampaign( campaign, newId ).subscribe(
          response => this.updateRoute(location)
        )
      );
    }
  }

  addActionAndAssociation(action: Action, entity: string, entityId: string) {
    const simpleHeaders = { responseType: 'text', observe: 'response' };
    this.actionService.addAction(action).toPromise().then(
        response => this.completeAssociation(response.headers.get('Location'), entity, entityId)
      );
  }

  updateRoute( location: string ) {
    const locattionNodes = _.split( location, '/' );
    const newId = _.last(locattionNodes);
    this.router.navigateByUrl( `/action/${newId}` );
    this.showAssocationSuccessful('company');
  }

  onCompanyAssociatedToEntity(company: Company) {
    console.log('onCompanyAssociatedToEntity:: end');
    if ( this.action && company ) {
      this.actionService.addActionToCompany(company, this.action.actionId )
        .subscribe(response => {
          this.showAssocationSuccessful('company');
        }, error => {
          this.handleAssociationFailure('company');
        } );
    }
  }

  onCompanyFlaggedForRemoval(companyId: string) {
    if ( this.action && companyId ) {
      this.actionService.removeActionFromCompany(companyId, this.action.actionId )
        .subscribe(response => {
          console.log('onCompanyFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('company');
        }, error => {
          this.handleAssociationFailure('company');
        } );
    }
  }

  onContactAssociatedToEntity(contact: Contact): void {
    console.log('onContactAssociatedToEntity:: end');
    if ( this.action && contact ) {
      this.actionService.addActionToContact(contact, this.action.actionId )
        .subscribe(response => {
          console.log('onContactAssociatedToEntity:: completed');
          this.showAssocationSuccessful('contact');
        }, error => {
          this.handleAssociationFailure('contact');
        } );
    }
  }

  onContactFlaggedForRemoval(contactId: string) {
    if ( this.action && contactId ) {
      this.actionService.removeActionFromContact(contactId, this.action.actionId )
        .subscribe(response => {
          console.log('onContactFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('contact');
        }, error => {
          this.handleAssociationFailure('contact');
        } );
    }
  }

  onCampaignAssociatedToEntity(campaign: Campaign): void {
    console.log('onCampaignAssociatedToEntity:: end');
    if ( this.action && campaign ) {
      this.actionService.addActionToCampaign(campaign, this.action.actionId )
        .subscribe(response => {
          console.log('onCampaignAssociatedToEntity:: completed');
            this.showAssocationSuccessful('campaign');
        }, error => {
          this.handleAssociationFailure('campaign');
        } );
    }
  }

  onCampaignFlaggedForRemoval(campaignId: string) {
    if ( this.action && campaignId ) {
      this.actionService.removeActionFromCampaign(campaignId, this.action.actionId )
        .subscribe(response => {
          console.log('onCampaignFlaggedForRemoval:: completed');
          this.showAssocationSuccessful('campaign');
        }, error => {
          this.handleAssociationFailure('campaign');
        } );
    }
  }

  updateTags = (tags: Tag[]) => {
    this.action.tags = tags;
    this.tagsIsDirty = true;
  };

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleAssociationFailure(entity: string, response?: any): void {
    if (entity === 'company') {
      this.companyFailureFlag = true;
    } else if (entity === 'campaign') {
      this.campaignFailureFlag = true;
    } else if (entity === 'contact') {
      this.contactFailureFlag = true;
    } else if ( entity === 'action' ) {
      this.actionFailureUpdated = true;
    }
    this.waitAndReset(entity);
  }

  showAssocationSuccessful(entity: string, response?: any): void {
    if ( entity === 'company' ) {
      this.companyFlag = true;
    } else if ( entity === 'campaign' ) {
      this.campaignFlag = true;
    } else if ( entity === 'contact' ) {
      this.contactFlag = true;
    } else if ( entity === 'action' ) {
      this.actionUpdated = true;
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
          this.contactFlag = false;
          this.contactFailureFlag = false;
        } else if ( entity === 'action' ) {
          this.actionUpdated = false;
          this.actionFailureUpdated = false;
        }
    });
  }

  getScopeTypes(): void {
    this.scopeTypeService.getScopeTypeList()
      .subscribe(scopeTypes => this.scopeTypes = scopeTypes);
  }

}
