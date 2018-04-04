import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpResponse} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Action} from '../classes/action';
import {Campaign} from '../classes/campaign';
import {Company} from '../classes/company';
import {Contact} from '../classes/contact';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class CampaignService extends BaseService {

  campaignUrl = ServiceConstants.CAMPAIGN_URL;
  cd = 'campaign'; // 'componentDescription'

  getCampaignList(): Observable<Campaign[]> {
     this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Campaign[]>(this.campaignUrl, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
         catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getCampaignListByCompany(companyId: string): Observable<Campaign[]> {
    const filterId = 'companyId';
    return this.getCampaignListByFilter(companyId, filterId );
  }

  getCampaignListByAction(actionId: string): Observable<Campaign[]> {
    const filterId = 'actionId';
    return this.getCampaignListByFilter(actionId, filterId );
  }

  getCampaignListByContact(contactId: string): Observable<Campaign[]> {
    const filterId = 'contactId';
    return this.getCampaignListByFilter(contactId, filterId );
  }

  getCampaignListByFilter(filterId: string, filterKey: string): Observable<Campaign[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${filterId}`);
    const url = `${this.campaignUrl}?${filterKey}=${filterId}`;
    return this.http.get<Campaign[]>(url, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${filterId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${filterId}`, []))
      );
  }

  getCampaign(id: string): Observable<Campaign> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.campaignUrl}/${id}`;
    return this.http.get<Campaign>(url, {
      headers: BaseService.headers})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
    );
  }

  addCampaign(campaign: Campaign): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    return this.http.post(this.campaignUrl, campaign, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap( response  => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
      catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
    );
  }

  updateCampaign(campaign: Campaign): Observable<any> {
    const id = campaign.campaignId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.campaignUrl}/${campaign.campaignId}`;
    return this.http.put(url, campaign, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
    );
  }

  addCampaignToContact(contact: Contact, campaignId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putContactToComponent(this.cd)}${campaignId}`);
    const url = `${this.campaignUrl}/${campaignId}/Contacts`;
    return this.http.put(url, contact, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putContactToComponent(this.cd)}${campaignId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putContactToComponent(this.cd)} ${campaignId}`))
    );
  }

  removeCampaignFromContact(contactId: string, campaignId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteContactFromComponent(this.cd)} ${campaignId} (contactId=${contactId}`);
    const url = `${this.campaignUrl}/${campaignId}/Contacts/${contactId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteContactFromComponent(this.cd)}${campaignId} (contactId=${contactId}`)),
       catchError(this.handleError<any>(`${this.E}${this.deleteContactFromComponent(this.cd)} ${campaignId} (contactId=${contactId}`))
    );
  }

  addCampaignToCompany(company: Company, campaignId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putCompanyToComponent(this.cd)} ${campaignId}`);
    const url = `${this.campaignUrl}/${campaignId}/Companies`;
    return this.http.put(url, company, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putCompanyToComponent(this.cd)} ${campaignId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putCompanyToComponent(this.cd)} ${campaignId}`))
    );
  }

  removeCampaignFromCompany(companyId: string, campaignId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteCompanyFromComponent(this.cd)} ${campaignId} (companyId=${companyId}`);
    const url = `${this.campaignUrl}/${campaignId}/Companies/${companyId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteCompanyFromComponent(this.cd)} ${campaignId} (companyId=${companyId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteCompanyFromComponent(this.cd)} ${campaignId} (companyId=${companyId}`))
    );
  }

  addCampaignToAction(action: Action, campaignId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putActionToComponent(this.cd)} ${campaignId}`);
    const url = `${this.campaignUrl}/${campaignId}/Actions`;
    return this.http.put(url, action, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putActionToComponent(this.cd)} ${campaignId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putActionToComponent(this.cd)} ${campaignId}`))
    );
  }

  removeCampaignFromAction(actionId: string, campaignId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteActionFromComponent(this.cd)} ${campaignId} (actionId=${actionId}`);
    const url = `${this.campaignUrl}/${campaignId}/Actions/${actionId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteActionFromComponent(this.cd)} ${campaignId} (actionId=${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteActionFromComponent(this.cd)} ${campaignId} (actionId=${actionId}`))
    );
  }

  closeCampaign(id: string): Observable<any> {
    // TODO: implement patch for th close action
    this.logger.debug(`TODO:${this.patchStatement(this.cd)}`);
    return null;
  }
}
