import {Action} from './action';
// import {Company} from './company';
import {Contact} from './contact';
import {Attachment} from './common/attachment';
import {Tag} from './common/tag';
import {ScopeType} from './types/scope-type';
import {CampaignClassificationType} from './types/campaign-classification-type';
import {EntityClassificationType} from "./types/entity-classification-type";
import {ContactTitleType} from "./types/contact-title-type";

export class Campaign {
  campaignId: string;
  ownerId: string;
  owner: Contact;
  name: string;
  description: string;
  active: boolean;
  restrictedToOwner: boolean;
  deactivationDate: Date;
  actualCompletionDate: Date;
  actualValuation: string;
  targetCompletionDate: Date;
  targetValuation: string;
  classificationType: CampaignClassificationType;
  scopeType: ScopeType;
  tags: Tag[];
  attachments: Attachment[];
  actions: Action[];
  contacts: Contact[];

  constructor() {
    this.active = true;
    this.classificationType = new CampaignClassificationType();
    this.scopeType = new ScopeType();
    this.actions = [];
    this.attachments = [];
    this.tags = [];
  }
}
