import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { catchError, tap } from 'rxjs/operators';

import { UrlType } from '../classes/types/url-type';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class ContactUrlTypeService extends BaseService {

  contactUrlTypeUrl = ServiceConstants.CONTACT_URL_TYPE_URL;
  cd = 'ContactUrlType'; // componentDescription

  getUrlTypeList(): Observable<UrlType[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<UrlType[]>(this.contactUrlTypeUrl, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getUrlType(id: string): Observable<UrlType> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.contactUrlTypeUrl}/${id}`;
    return this.http.get<UrlType>(url, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }
}
