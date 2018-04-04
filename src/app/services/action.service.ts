import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Action} from '../classes/action';
import {Email} from '../classes/email';
import {Campaign} from '../classes/campaign';
import {Company} from '../classes/company';
import {Contact} from '../classes/contact';

import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class ActionService extends BaseService {

  actionUrl = ServiceConstants.ACTION_URL;
  emailUrl = ServiceConstants.EMAIL_URL;

  cd = 'action'; // 'componentDescription'

  getOneEmailStatement = (cd: string) => `${cd} one EMAIL ${this.whoseId} `;

  getActionList(): Observable<Action[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Action[]>(this.actionUrl, {
        headers: BaseService.headers} )
      .pipe(
        tap(actions => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
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
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${filterId}`);
    const url = `${this.actionUrl}?${filterKey}=${filterId}`;
    return this.http.get<Action[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(actions => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${filterId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${filterId}`, []))
      );
  }

  getAction(id: string): Observable<Action> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.actionUrl}/${id}`;
    return this.http.get<Action>(url, {
      headers: BaseService.headers} )
      .pipe(
      tap(result => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
      catchError(this.handleError<Action>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
    );
  }

  getEmail(id: string): Observable<Email> {
    this.logger.debug(`${this.P}${this.getOneEmailStatement(this.cd)} ${id}`);
    const url = `${this.emailUrl}/${id}`;
    return this.http.get<Email>(url, {
      headers: BaseService.headers} )
      .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.getOneEmailStatement(this.cd)} ${id}`)),
      catchError(this.handleError<Email>(`${this.E}${this.getOneEmailStatement(this.cd)} ${id}`))
    );
  }

  addAction(action: Action): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    return this.http.post(this.actionUrl, action, {
        headers: BaseService.headers,
        responseType: BaseService.responseTypeValue,
        observe: BaseService.observeValue} )
    .pipe(
      tap(response => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
      catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
    );
  }

  updateAction(action: Action): Observable<HttpResponse<any>> {
    const id = action.actionId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.actionUrl}/${action.actionId}`;
    return this.http.put(url, action, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
    );
  }

  deleteAction(id: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteStatement(this.cd)} ${id}`);
    const url = `${this.actionUrl}/${id}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteStatement(this.cd)}${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteStatement(this.cd)} ${id}`))
    );
  }

  addActionToCompany(company: Company, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putCompanyToComponent(this.cd)}${actionId}`);
    const url = `${this.actionUrl}/${actionId}/Companies`;
    return this.http.put(url, company, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putCompanyToComponent(this.cd)}${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putCompanyToComponent(this.cd)} ${actionId}`))
    );
  }

  removeActionFromCompany(companyId: string, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteCompanyFromComponent(this.cd)} ${actionId} (companyId=${companyId}`);
    const url = `${this.actionUrl}/${actionId}/Companies/${companyId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteCompanyFromComponent(this.cd)}${actionId} (companyId=${companyId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteCompanyFromComponent(this.cd)} ${actionId} (companyId=${companyId}`))
    );
  }

  addActionToContact(contact: Contact, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putContactToComponent(this.cd)} ${actionId}`);
    const url = `${this.actionUrl}/${actionId}/Contacts`;
    return this.http.put(url, contact, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putContactToComponent(this.cd)} ${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putContactToComponent(this.cd)} ${actionId}`))
    );
  }

  removeActionFromContact(contactId: string, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteContactFromComponent(this.cd)} ${actionId} (contactId=${contactId}`);
    const url = `${this.actionUrl}/${actionId}/Contacts/${contactId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteContactFromComponent(this.cd)} ${actionId} (contactId=${contactId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteContactFromComponent(this.cd)} ${actionId} (contactId=${contactId}`))
    );
  }

  addActionToCampaign(campaign: Campaign, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putCampaignToComponent(this.cd)} ${actionId}`);
    const url = `${this.actionUrl}/${actionId}/Campaigns`;
    return this.http.put(url, campaign, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putCampaignToComponent(this.cd)} ${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putCampaignToComponent(this.cd)} ${actionId}`))
    );
  }

  removeActionFromCampaign(campaignId: string, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteCampaignFromComponent(this.cd)} ${actionId} (campaignId=${campaignId}`);
    const url = `${this.actionUrl}/${actionId}/Campaigns/${campaignId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteCampaignFromComponent(this.cd)} ${actionId} (campaignId=${campaignId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteCampaignFromComponent(this.cd)} ${actionId} (campaignId=${campaignId}`))
    );
  }

  closeAction(id: string): Observable<any> {
    // TODO: implement patch for th close action
    this.logger.debug(`TODO:${this.patchStatement(this.cd)}`);
    return null;
  }
}
