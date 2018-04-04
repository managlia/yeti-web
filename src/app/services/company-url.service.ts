import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { Url } from '../classes/common/url';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class CompanyUrlService extends BaseService {

  companyUrlUrl = ServiceConstants.COMPANY_URL_URL;
  cd = 'CompanyUrl'; //componentDescription

  getUrlList(): Observable<Url[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Url[]>(this.companyUrlUrl, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getUrl(id: string): Observable<Url> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.companyUrlUrl}/${id}`;
    return this.http.get<Url>(url, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
    );
  }
}
