import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {ServiceConstants} from '../service-constants';
import { CompanyService } from './company.service';
import { ContactService } from './contact.service';
import { CampaignService } from './campaign.service';
import { ActionService } from './action.service';
import { CompanyOrContactService } from './company-or-contact.service';

import { Company } from '../classes/company';
import { Contact } from '../classes/contact';
import { Campaign } from '../classes/campaign';
import { Action } from '../classes/action';
import { CompanyOrContact } from '../classes/common/company-or-contact';

@Injectable()
export class EntityService {

  constructor(
    private companyService: CompanyService,
    private contactService: ContactService,
    private campaignService: CampaignService,
    private actionService: ActionService,
    private companyOrContactService: CompanyOrContactService
  ) { }

  getCompanyById(id: string): Observable<Company> {
    return this.companyService.getCompany(id);
  }

  getContactById(id: string): Observable<Contact> {
    return this.contactService.getContact(id);
  }

  getCampaignById(id: string): Observable<Campaign> {
    return this.campaignService.getCampaign(id);
  }

  getActionById(id: string): Observable<Action> {
    return this.actionService.getAction(id);
  }

  getCompanyOrContact(term: string): Observable<CompanyOrContact[]> {
    return this.companyOrContactService.searchCompanyAndContact(term);
  }

}
