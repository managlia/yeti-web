import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import chalk from 'chalk';

import {ActionClassificationOtherTypeService} from '../../../services/action-classification-other-type.service';
import {ActionClassificationOtherType} from '../../../classes/types/action-classification-other-type';
import {ActionClassificationTypeService} from '../../../services/action-classification-type.service';
import {ActionService} from '../../../services/action.service';
import {CampaignClassificationTypeService} from '../../../services/campaign-classification-type.service';
import {CampaignService} from '../../../services/campaign.service';
import {ChatterService} from '../../widgets/chatter.service';
import {CompanyAddressClassificationTypeService} from '../../../services/company-address-classification-type.service';
import {CompanyClassificationTypeService} from '../../../services/company-classification-type.service';
import {CompanyOrContactService} from '../../../services/company-or-contact.service';
import {CompanyPhoneTypeService} from '../../../services/company-phone-type.service';
import {CompanyService} from '../../../services/company.service';
import {CompanyUrlTypeService} from '../../../services/company-url-type.service';
import {Company} from '../../../classes/company';
import {ContactAddressClassificationTypeService} from '../../../services/contact-address-classification-type.service';
import {ContactClassificationTypeService} from '../../../services/contact-classification-type.service';
import {ContactPhoneTypeService} from '../../../services/contact-phone-type.service';
import {ContactService} from '../../../services/contact.service';
import {ContactTitleTypeService} from '../../../services/contact-title-type.service';
import {ContactTitleType} from '../../../classes/types/contact-title-type';
import {ContactUrlTypeService} from '../../../services/contact-url-type.service';
import {Contact} from '../../../classes/contact';
import {AddressClassificationType} from '../../../classes/types/address-classification-type';
import {DataStore} from '../../../classes/data-store';
import {EmailService} from '../../../services/email.service';
import {EntityService} from '../../../services/entity.service';
import {PhoneType} from '../../../classes/types/phone-type';
import {ScopeTypeService} from '../../../services/scope-type.service';
import {Team} from '../../../classes/team';
import {TeamService} from '../../../services/team.service';
import {UrlType} from '../../../classes/types/url-type';
import * as label from '../../labels';
import {AttachmentService} from '../../../services/attachment.service';
import {AnnouncementService} from '../../../services/announcement.service';
import {MemoService} from '../../../services/memo.service';
import {NoteService} from '../../../services/note.service';

@Component({
  selector: 'app-base-view',
  templateUrl: './base-view.component.html',
  styleUrls: ['./base-view.component.scss']
})
export class BaseViewComponent implements OnInit {

  resourceId = DataStore.userId;
  userTimezone = DataStore.userTimezone;

  entityName = 'OverrideInTheViewDetails';
  entityFormGroup: FormGroup;
  entityLoaded = false;
  notesOnTop = false;
  typesPromise: any;
  typesLoaded = false;

  public dirtyCardColor = 'deeppink';
  bgColor = 'black';
  highlightColor = 'rebeccapurple';
  public readonly label = label;

  actionFlag = false;
  contactFlag = false;
  campaignFlag = false;
  companyFlag = false;
  teamFlag = false;
  communicationFlag = false;

  actionFailureFlag = false;
  companyFailureFlag = false;
  contactFailureFlag = false;
  campaignFailureFlag = false;
  teamFailureFlag = false;
  communicationFailureFlag = false;

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
  titleTypes: ContactTitleType[];
  teams: Team[];

  entity: string;
  entityId: string;

  goBack = () => this.location.back();

  constructor(
    public actionClassificationOtherTypeService: ActionClassificationOtherTypeService,
    public actionClassificationTypeService: ActionClassificationTypeService,
    public actionService: ActionService,
    public attachmentService: AttachmentService,
    public campaignClassificationTypeService: CampaignClassificationTypeService,
    public campaignService: CampaignService,
    public chatterService: ChatterService,
    public companyAddressClassificationTypeService: CompanyAddressClassificationTypeService,
    public companyClassificationTypeService: CompanyClassificationTypeService,
    public companyOrContactService: CompanyOrContactService,
    public companyPhoneTypeService: CompanyPhoneTypeService,
    public companyService: CompanyService,
    public companyUrlTypeService: CompanyUrlTypeService,
    public contactAddressClassificationTypeService: ContactAddressClassificationTypeService,
    public contactClassificationTypeService: ContactClassificationTypeService,
    public contactPhoneTypeService: ContactPhoneTypeService,
    public contactService: ContactService,
    public contactTitleTypeService: ContactTitleTypeService,
    public contactUrlTypeService: ContactUrlTypeService,
    public emailService: EmailService,
    public entityService: EntityService,
    public formBuilder: FormBuilder,
    public location: Location,
    public renderer: Renderer2,
    public route: ActivatedRoute,
    public router: Router,
    public scopeTypeService: ScopeTypeService,
    public teamService: TeamService,
    public announcementService: AnnouncementService,
    public memoService: MemoService,
    public noteService: NoteService
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
    } else if (entity === 'team') {
      this.teamFailureFlag = true;
    } else if (entity === 'company') {
      this.companyFailureFlag = true;
    } else if (entity === 'communication') {
      this.communicationFailureFlag = true;
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
    } else if (entity === 'team') {
      this.teamFlag = true;
    } else if (entity === 'action') {
      this.actionFlag = true;
    } else if (entity === 'communication') {
      this.communicationFlag = true;
    }
    this.resetTheDirty();
    this.waitAndReset(entity);
  }

  waitAndReset(entity: string): void {
    this.delay(5000).then(resolve => {
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
        } else if (entity === 'team') {
          this.teamFlag = false;
          this.teamFailureFlag = false;
        } else if (entity === 'communication') {
          this.communicationFlag = false;
          this.communicationFailureFlag = false;
        }
      }
    );
  }

  toggleNotesPosition = () => {
    this.notesOnTop = !this.notesOnTop;
  };

  orderCompanyContents(company: Company): Company {
    company.tags = _.sortBy(company.tags, ['name']);
    return company;
  }

  orderContactContents(contact: Contact): Contact {
    contact.tags = _.sortBy(contact.tags, ['name']);
    return contact;
  }

  readyToSave(): boolean {
    const cardChanged = this.addressIsDirty || this.urlsIsDirty || this.phonesIsDirty
      || this.tagsIsDirty || this.attachmentsIsDirty || this.entityFormGroup.dirty;
    return (cardChanged && this.entityFormGroup.valid);
  }

  possiblyTriggerErrorMessages = () => {
    if ( this.entityFormGroup.invalid ) {
      Object.keys(this.entityFormGroup.controls)
        .forEach( c => this.entityFormGroup.controls[c].markAsTouched() );
    }
  };

  loadTeams = () => {
      this.teamService.getTeamListByContact( this.resourceId )
        .subscribe(teams => this.teams = teams);
  };

  resetTheDirty = () => {
    this.addressIsDirty = false;
    this.urlsIsDirty = false;
    this.phonesIsDirty = false;
    this.tagsIsDirty = false;
    this.attachmentsIsDirty = false;
  };

  readyToSaveColor = () => {
    if (this.readyToSave()) {
      return this.dirtyCardColor;
    } else {
      return '#f0f3f5';
    }
  };

  emailValidator = () => {
    return Validators.compose([
      Validators.email
    ])
  };

  unreadyToSave(): boolean {
    return !this.readyToSave();
  }
}
