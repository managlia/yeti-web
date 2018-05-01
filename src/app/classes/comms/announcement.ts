import {CommAudit} from './comm-audit';
import {Contact} from '../contact';

// typically a company-wide message

export class Announcement {

  // creatorDetails: Contact;
  audit: CommAudit;
  announcementId;
  creatorId;
  creatorExternalId;
  description;
  value;
  isArchived;
  createDate;
  updateDate;
  communicationType;

  constructor() {
    this.audit = new CommAudit();
  }

}
