import {Contact} from '../contact';

export class Attachment {
  fileId;
  fileStoragePath;
  fileName;
  fileType;
  fileSize;
  uploaderId;
  uploaderExternalId;
  entityType;
  entityId;
  storageDate;
  entityData;
  uploaderData: Contact;

  constructor() {
  }
}
