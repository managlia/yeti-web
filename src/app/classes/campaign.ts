import {Action} from './action';
import {Contact} from './contact';
import {Attachment} from './common/attachment';
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
  targetCompletionDate: Date;
  classificationType: CampaignClassificationType;
  scopeType: ScopeType;
  tags: Tag[];
  attachments: Attachment[];
  actions: Action[];
  contacts: Contact[];
  teamId: string;
  importance: number;
  difficulty: number;

  constructor() {
    this.active = true;
    this.scopeType = new ScopeType();
    this.classificationType = new CampaignClassificationType();
    this.actions = [];
    this.attachments = [];
    this.tags = [];
    this.importance = 5;
    this.difficulty = 5;
  }
}
