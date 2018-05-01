export class CommAudit {

  commId: string;
  userId: string;
  firstSeenDate: Date;
  lastSeenDate: Date;
  haveRead: boolean;
  havePinned: boolean;

  constructor() {
    this.haveRead = false;
    this.havePinned = false;
  }

}
