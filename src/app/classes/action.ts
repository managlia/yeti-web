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
  createDate: Date;
  targetCompletionDate: Date;
  targetCompletionDateEnd: Date;
  actualCompletionDate: Date;
  classificationType: ActionClassificationType;
  classificationOtherType: ActionClassificationOtherType;
  scopeType: ScopeType;
  tags: Tag[];
  attachments: Attachment[];
  actionChildren: Action[];
  teamId: string;
  importance: number;
  difficulty: number;

  constructor() {
    // this.targetCompletionDate = new Date();
    // this.targetCompletionDateEnd = new Date();
    this.active = true;
    this.deleteable = true;
    this.classificationType = new ActionClassificationType();
    this.scopeType = new ScopeType();
    this.classificationOtherType = new ActionClassificationOtherType();
    this.actionChildren = [];
    this.attachments = [];
    this.tags = [];
    this.importance = 5;
    this.difficulty = 5;
  }
}
