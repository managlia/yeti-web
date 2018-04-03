export class Attachment {
  attachmentId: string;
  name: string;
  attachmentPath: string;
  attachmentType: string;
  attachmentFile: any[];
  createDate: Date;

  constructor(
    attachmentId: string,
    name: string,
    attachmentPath: string,
    attachmentType: string,
  ) {
    this.attachmentId = attachmentId;
    this.name = name;
    this.attachmentPath = attachmentPath;
    this.attachmentType = attachmentType;
  }
}
