import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { ContactTitleType } from '../classes/types/contact-title-type';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class ContactTitleTypeService extends BaseService {

  contactTitleTypeUrl = ServiceConstants.CONTACT_TITLE_TYPE_URL;
  cd = 'ContactTitleType'; // componentDescription

  getTitleTypeList(): Observable<ContactTitleType[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<ContactTitleType[]>(this.contactTitleTypeUrl, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getTitleType(id: string): Observable<ContactTitleType> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.contactTitleTypeUrl}/${id}`;
    return this.http.get<ContactTitleType>(url, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }
}
