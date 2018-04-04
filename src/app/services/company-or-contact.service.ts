import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { BaseService } from './base.service';
import {ServiceConstants} from '../service-constants';
import { CompanyOrContact } from '../classes/common/company-or-contact';

@Injectable()
export class CompanyOrContactService extends BaseService {

  companyOrContactUrl = ServiceConstants.COMPANY_OR_CONTACT_URL;
  cd = 'CompanyOrContact'; // componentDescription
  getFilterStatement = (cd: string) => `${this.getDescription} all ${cd}s ${this.whoseFilter} `;

  searchCompanyAndContact(term: string): Observable<CompanyOrContact[]> {
    const key = 'term';
    return this.doSearch( term, key );
  }

  searchCompany(term: string): Observable<CompanyOrContact[]> {
    const key = 'company';
    return this.doSearch( term, key );
  }

  searchContact(term: string): Observable<CompanyOrContact[]> {
    const key = 'contact';
    return this.doSearch( term, key );
  }

  doSearch(term: string, key: string): Observable<CompanyOrContact[]> {
    this.logger.debug(`${this.P}${this.getFilterStatement(this.cd)}${key} === "${term}"`);
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<CompanyOrContact[]>(`${this.companyOrContactUrl}/?${key}=${term}`)
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getFilterStatement(this.cd)}${key} === "${term}"`)),
        catchError(this.handleError<any>(`${this.E}${this.getFilterStatement(this.cd)}${key} === "${term}"`))
      );
  }
}
