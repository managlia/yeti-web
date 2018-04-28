import { Injectable } from '@angular/core';

import {Company} from './company';
import {Contact} from './contact';
import {Campaign} from './campaign';
import {Action} from './action';

@Injectable()
export class DataStore {

  static readonly userId: string = '1';
  static readonly companyId: string = '1';
  static readonly userTimezone: string = 'America/Chicago';

  user: Contact;
  hostCompany: Company;

  // temp till data-store is active
  // userId = '1';


  loadedCompany: Company;
  loadedCompanyContacts: Contact[];
  loadedCompanyCampaigns: Campaign[];
  loadedCompanyActions: Action[];

  loadedContact: Contact;
  loadedContactCampaigns: Campaign[];
  loadedContactActions: Action[];
  loadedCampaignActions: Action[];
}
