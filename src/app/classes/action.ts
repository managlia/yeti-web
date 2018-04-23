import {Contact} from './contact';
import {ActionClassificationType} from './types/action-classification-type';
import {ActionClassificationOtherType} from './types/action-classification-other-type';
import {Attachment} from './common/attachment';
import {ScopeType} from './types/scope-type';
import {Tag} from './common/tag';
import {CalendarEvent} from './calendar-event';

export class Action {
  contacts: Contact[];
  calendarEvents: CalendarEvent[];
  id: string;
  itemName: string;
  ownerId: string;
  owner: Contact;
  actionId: string;
  active: boolean;
  deleteable: boolean;
  description: string;
  name: string;
  targetValuation: string;
  createDate: Date;
  targetCompletionDate: Date;
  actualValuation: string;
  actualCompletionDate: Date;
  classificationType: ActionClassificationType;
  classificationOtherType: ActionClassificationOtherType;
  scopeType: ScopeType;
  tags: Tag[];
  attachments: Attachment[];
  actionChildren: Action[];
  teamId: string;

  constructor() {
    this.active = true;
    this.deleteable = true;
    this.classificationType = new ActionClassificationType();
    this.classificationOtherType = new ActionClassificationOtherType();
    this.actionChildren = [];
    this.attachments = [];
    this.tags = [];
  }
}
