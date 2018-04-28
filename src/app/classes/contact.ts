import {EntityClassificationType} from './types/entity-classification-type';
import {ContactTitleType} from './types/contact-title-type';
import {Url} from './common/url';
import {Attachment} from './common/attachment';
import {Address} from './common/address';
import {Tag} from './common/tag';
import {Company} from './company';
import {Phone} from './common/phone';

export class Contact {

  emailRecipientIndicator: string;
  contactId: string;
  companyId: string;
  company: Company;
  active: boolean;
  firstName: string;
  lastName: string;
  contactEmailAddress: string;
  description: string;
  createDate: Date;
  deactivationDate: Date;
  dob: Date;
  lastModifiedDate: Date;
  classificationType: EntityClassificationType;
  titleType: ContactTitleType;
  addresses: Address[];
  attachments: Attachment[];
  tags: Tag[];
  urls: Url[];
  phones: Phone[];

  constructor() {
    this.active = true;
    this.classificationType = new EntityClassificationType();
    this.titleType = new ContactTitleType();
    this.addresses = [];
    this.attachments = [];
    this.tags = [];
    this.urls = [];
    this.phones = [];
  }
  get name() { return this.firstName + ' ' + this.lastName };

}

