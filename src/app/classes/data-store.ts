import { Injectable } from '@angular/core';

import {Company} from './company';
import {Contact} from './contact';
import {Campaign} from './campaign';
import {Action} from './action';

@Injectable()
export class DataStore {
  user: Contact;
  hostCompany: Company;

  //temp till data-store is active
  userId = '1';

  loadedCompany: Company;
  loadedCompanyContacts: Contact[];
  loadedCompanyCampaigns: Campaign[];
  loadedCompanyActions: Action[];

  loadedContact: Contact;
  loadedContactCampaigns: Campaign[];
  loadedContactActions: Action[];

  loadedCampaignActions: Action[];
}
