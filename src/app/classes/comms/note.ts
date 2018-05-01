// typically a message added to a specific entity (action/campaign/company/contact)
import {Announcement} from './announcement';

export class Note extends Announcement {

  noteId;
  entityType;
  entityId;

  constructor() {
    super();
  }
}
