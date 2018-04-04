import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Email} from '../classes/email';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';
import {Action} from '../classes/action';

@Injectable()
export class EmailService extends BaseService {

  results: string[];
  emailUrl = ServiceConstants.EXT_EMAIL_URL;
  cd = 'Email' // componentDescription

  getEmailList(): Observable<Email[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Email[]>(this.emailUrl, {
      headers: BaseService.headers} )
      .pipe(
        tap(actions => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getEmailListByFilter(filterId: string, filterKey: string): Observable<Email[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${filterId}`);
    const url = `${this.emailUrl}?${filterKey}=${filterId}`;
    return this.http.get<Email[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(actions => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${filterId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${filterId}`, []))
      );
  }

  getEmail(id: string): Observable<Email> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.emailUrl}/${id}`;
    return this.http.get<Email>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(result => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }

  sendEmail(email: Email): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    const simpleHeaders = { responseType: 'text', observe: 'response' };
    return this.http.post(this.emailUrl, email, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(response => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
        catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
      );
  }

  updateEmail(email: Email): Observable<any> {
    const id = email.id;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.emailUrl}/${email.id}`;
    return this.http.put(url, email, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
      );
  }
}





