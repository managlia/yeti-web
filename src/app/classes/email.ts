import { Action } from './action';
import {Contact} from './contact';

export class Email extends Action {

  deliveryReceipt: boolean;
  readReceipt: boolean;
  reminderRequested: boolean;
  reminderDate: Date;

  instanceDate: Date;
  lastRetrievedDate: Date;
  threadId: string;

  recipients: Contact[];

}



