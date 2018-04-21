import {Action} from './action';
import {Contact} from './contact';
import {File} from './common/file';
import {Tag} from './common/tag';
import {ScopeType} from './types/scope-type';
import {CampaignClassificationType} from './types/campaign-classification-type';

export class Campaign {
  campaignId: string;
  ownerId: string;
  owner: Contact;
  name: string;
  description: string;
  active: boolean;
  deleteable: boolean;
  restrictedToOwner: boolean;
  createDate: Date;
  deactivationDate: Date;
  actualCompletionDate: Date;
  actualValuation: string;
  targetCompletionDate: Date;
  targetValuation: string;
  classificationType: CampaignClassificationType;
  scopeType: ScopeType;
  tags: Tag[];
  attachments: File[];
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
