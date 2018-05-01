// typically a message with a specified group of recipients
import {Announcement} from './announcement';

export class Memo extends Announcement {
  memoId;
  recipients: string[];

  constructor() {
    super();
  }
}
