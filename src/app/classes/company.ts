import {EntityClassificationType} from './types/entity-classification-type';
import {Url} from './common/url';
import {Phone} from './common/phone';
import {Address} from './common/address';

export class Company {

  companyId: string;
  name: string;
  description: string;
  externalId: string;
  active: boolean;
  createDate: Date;
  deactivationDate: Date;
  lastModifiedDate: Date;
  targetDate: Date;
  classificationType: EntityClassificationType;
  addresses: Address[];
  attachments: any[];
  tags: any[];
  urls: Url[];
  phones: Phone[];

  constructor() {
    this.active = true;
    this.classificationType = new EntityClassificationType();
    this.addresses = [];
    this.attachments = [];
    this.tags = [];
    this.urls = [];
    this.phones = [];
  }
}
