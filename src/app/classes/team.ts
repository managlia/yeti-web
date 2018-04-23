import {Contact} from './contact';

export class Team {
  teamId: string;
  name: string;
  description: string;
  active: boolean;
  creatorId: string;
  creatorDate: Date;
  createDate: Date;
  deactivationDate: Date;
  lastModifiedDate: Date;
  contacts: Contact[];

  constructor() {
    this.active = true;
  }
}
