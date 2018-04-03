import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import {Action} from '../classes/action';
import {Email} from '../classes/email';
import {Campaign} from '../classes/campaign';
import {Company} from '../classes/company';
import {Contact} from '../classes/contact';
import {BaseService} from './base.service';
import {IRequestOptions} from './irequest-options';

const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-TEST-EXTRA': 'ABC'
});
const observeValue = 'response';
const responseTypeValue = 'text';

@Injectable()
export class ActionService extends BaseService {

  results: string[];
  actionUrl = ServiceConstants.ACTION_URL;
  emailUrl = ServiceConstants.EMAIL_URL;

  componentDescription = 'action';
  getAllStatement = `${this.getDescription} all ${this.componentDescription}s`;
  getAllFilterStatement = `${this.getDescription} all ${this.componentDescription}s ${this.whoseFilter} `;
  getOneStatement = `${this.getDescription} one ${this.componentDescription} ${this.whoseId} `;
  postStatement = `${this.postDescription} ${this.componentDescription}  ${this.whoseId}  ${this.foundOn} `;
  putStatement = `${this.putDescription} one ${this.componentDescription} ${this.whoseId} `;
  deleteStatement = `${this.deleteDescription} ${this.componentDescription} ${this.whoseId} `;
  patchStatement = `${this.patchDescription} ${this.componentDescription} ${this.whoseFilter} `;

  getOneEmailStatement = `${this.getDescription} one EMAIL ${this.whoseId} `;
  putCompanyToComponent = `${this.putDescription} COMPANY/ADDING TO ${this.componentDescription} ${this.whoseId} `;
  deleteCompanyFromComponent = `${this.deleteDescription} COMPANY FROM ${this.componentDescription} ${this.whoseId} `;
  putContactToComponent = `${this.putDescription} CONTACT/ADDING TO ${this.componentDescription} ${this.whoseId}`;
  deleteContactFromComponent = `${this.deleteDescription} CONTACT FROM ${this.componentDescription} ${this.whoseId} `;
  putCampaignToComponent = `${this.putDescription} CAMPAIGN/ADDING TO ${this.componentDescription} ${this.whoseId}`;
  deleteCampaignFromComponent = `${this.deleteDescription} CAMPAIGN FROM ${this.componentDescription} ${this.whoseId} `;

  getActionList(): Observable<Action[]> {
    this.logger.debug(`${this.P}${this.getAllStatement}`);
    return this.http.get<Action[]>(this.actionUrl, {headers: headers})
      .pipe(
        tap(actions => this.logger.debug(`${this.S}${this.getAllStatement}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement}`, []))
      );
  }

  getActionListByCompany(companyId: string): Observable<Action[]> {
    const filterId = 'companyId';
    return this.getActionListByFilter(companyId, filterId);
  }

  getActionListByCampaign(campaignId: string): Observable<Action[]> {
    const filterId = 'campaignId';
    return this.getActionListByFilter(campaignId, filterId);
  }

  getActionListByContact(contactId: string): Observable<Action[]> {
    const filterId = 'contactId';
    return this.getActionListByFilter(contactId, filterId);
  }

  getActionListByFilter(filterId: string, filterKey: string): Observable<Action[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement} ${filterId}`);
    const url = `${this.actionUrl}?${filterKey}=${filterId}`;
    return this.http.get<Action[]>(url)
      .pipe(
        tap(actions => this.logger.debug(`${this.S}${this.getAllFilterStatement} ${filterId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement} ${filterId}`, []))
      );
  }

  getAction(id: string): Observable<Action> {
    this.logger.debug(`${this.P}${this.getOneStatement} ${id}`);
    const url = `${this.actionUrl}/${id}`;
    return this.http.get<Action>(url).pipe(
      tap(result => this.logger.debug(`${this.S}${this.getOneStatement}${id}`)),
      catchError(this.handleError<Action>(`${this.E}${this.getOneStatement} ${id}`))
    );
  }

  getEmail(id: string): Observable<Email> {
    this.logger.debug(`${this.P}${this.getOneEmailStatement} ${id}`);
    const url = `${this.emailUrl}/${id}`;
    return this.http.get<Email>(url).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.getOneEmailStatement} ${id}`)),
      catchError(this.handleError<Email>(`${this.E}${this.getOneEmailStatement} ${id}`))
    );
  }

  addAction(action: Action): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement}`);
    return this.http.post(this.actionUrl, action, {
        headers: headers,
        responseType: responseTypeValue,
        observe: observeValue} )
    .pipe(
      tap(response => this.logger.debug(`${this.S}${this.postStatement}${response.headers.get('Location')}`),
      catchError(this.handleError<any>(`${this.E}${this.postStatement}`))
    );
  }

  updateAction(action: Action): Observable<any> {
    const id = action.actionId;
    this.logger.debug(`${this.P}${this.putStatement} ${id}`);
    const url = `${this.actionUrl}/${action.actionId}`;
    return this.http.put(url, action, {headers: headers} ).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putStatement} ${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.putStatement} ${id}`))
    );
  }

  deleteAction(id: string): Observable<any> {
    this.logger.debug(`${this.P}${this.deleteStatement} ${id}`);
    const url = `${this.actionUrl}/${id}`;
    return this.http.delete(url, {responseType: 'text', observe: 'response'}).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteStatement}${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteStatement} ${id}`))
    );
  }

  addActionToCompany(company: Company, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putCompanyToComponent}${actionId}`);
    const url = `${this.actionUrl}/${actionId}/Companies`;
    return this.http.put(url, company, {responseType: 'text', observe: 'response'}).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putCompanyToComponent}${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putCompanyToComponent} ${actionId}`))
    );
  }

  removeActionFromCompany(companyId: string, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteCompanyFromComponent} ${actionId} (companyId=${companyId}`);
    const url = `${this.actionUrl}/${actionId}/Companies/${companyId}`;
    return this.http.delete(url, {responseType: 'text', observe: 'response'}).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteCompanyFromComponent}${actionId} (companyId=${companyId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteCompanyFromComponent} ${actionId} (companyId=${companyId}`))
    );
  }

  addActionToContact(contact: Contact, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putContactToComponent} ${actionId}`);
    const url = `${this.actionUrl}/${actionId}/Contacts`;
    return this.http.put(url, contact, {responseType: 'text', observe: 'response'}).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putContactToComponent} ${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putContactToComponent} ${actionId}`))
    );
  }

  removeActionFromContact(contactId: string, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteContactFromComponent} ${actionId} (contactId=${contactId}`);
    const url = `${this.actionUrl}/${actionId}/Contacts/${contactId}`;
    return this.http.delete(url, {responseType: 'text', observe: 'response'}).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteContactFromComponent} ${actionId} (contactId=${contactId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteContactFromComponent} ${actionId} (contactId=${contactId}`))
    );
  }

  addActionToCampaign(campaign: Campaign, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putCampaignToComponent} ${actionId}`);
    const url = `${this.actionUrl}/${actionId}/Campaigns`;
    return this.http.put(url, campaign, {responseType: 'text', observe: 'response'}).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putCampaignToComponent} ${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putCampaignToComponent} ${actionId}`))
    );
  }

  removeActionFromCampaign(campaignId: string, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteCampaignFromComponent} ${actionId} (campaignId=${campaignId}`);
    const url = `${this.actionUrl}/${actionId}/Campaigns/${campaignId}`;
    return this.http.delete(url, {responseType: 'text', observe: 'response'}).pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteCampaignFromComponent} ${actionId} (campaignId=${campaignId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteCampaignFromComponent} ${actionId} (campaignId=${campaignId}`))
    );
  }

  closeAction(id: string): Observable<any> {
    // todo: implement patch for th close action
    this.logger.debug(`TODO:${this.patchStatement}`);
    return null;
  }
}
