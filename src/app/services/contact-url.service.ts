import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { Url } from '../classes/common/url';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class ContactUrlService extends BaseService {

  contactUrlUrl = ServiceConstants.CONTACT_URL_URL;
  cd = 'ContactUrl'; // componentDescription

  getUrlList(): Observable<Url[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Url[]>(this.contactUrlUrl, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getUrl(id: string): Observable<Url> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.contactUrlUrl}/${id}`;
    return this.http.get<Url>(url, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }
}
