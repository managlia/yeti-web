import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Action} from '../classes/action';
import {Campaign} from '../classes/campaign';
import {Company} from '../classes/company';
import {Contact} from '../classes/contact';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class CompanyService extends BaseService {

  companyUrl = ServiceConstants.COMPANY_URL;
  cd = 'Company'; // 'componentDescription'

  getCompanyList(): Observable<Company[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Company[]>(this.companyUrl, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
         catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getCompanyListByContact(contactId: string): Observable<Company[]> {
    const filterId = 'contactId';
    return this.getCompanyListByFilter(contactId, filterId );
  }

  getCompanyListByAction(actionId: string): Observable<Company[]> {
    const filterId = 'actionId';
    return this.getCompanyListByFilter(actionId, filterId );
  }

  getCompanyListByCampaign(campaignId: string): Observable<Company[]> {
    const filterId = 'campaignId';
    return this.getCompanyListByFilter(campaignId, filterId );
  }

  getCompanyListByFilter(filterId: string, filterKey: string): Observable<Company[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${filterId}`);
    const url = `${this.companyUrl}?${filterKey}=${filterId}`;
    return this.http.get<Company[]>(url, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${filterId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${filterId}`, []))
      );
  }

  getCompany(id: string): Observable<Company> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.companyUrl}/${id}`;
    return this.http.get<Company>(url, {
      headers: BaseService.headers})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
    );
  }

  addCompany(company: Company): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    return this.http.post(this.companyUrl, company, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap( response  => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
      catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
    );
  }

  updateCompany(company: Company): Observable<any> {
    const id = company.companyId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.companyUrl}/${company.companyId}`;
    return this.http.put(url, company, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
    );
  }

  addContactToCompany(companyId: string, contact: Contact): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putContactToComponent(this.cd)}${companyId}`);
    const url = `${this.companyUrl}/${companyId}/Contacts`;
    return this.http.put(url, contact, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putContactToComponent(this.cd)}${companyId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putContactToComponent(this.cd)} ${companyId}`))
    );
  }

  removeContactFromCompany(companyId: string, contactId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteContactFromComponent(this.cd)} ${companyId} (contactId=${contactId}`);
    const url = `${this.companyUrl}/${companyId}/Contacts/${contactId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteContactFromComponent(this.cd)}${companyId} (contactId=${contactId}`)),
       catchError(this.handleError<any>(`${this.E}${this.deleteContactFromComponent(this.cd)} ${companyId} (contactId=${contactId}`))
    );
  }

  addCampaignToCompany(companyId: string, campaign: Campaign): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putCampaignToComponent(this.cd)} ${companyId}`);
    const url = `${this.companyUrl}/${companyId}/Campaigns`;
    return this.http.put(url, campaign, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putCampaignToComponent(this.cd)} ${companyId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putCampaignToComponent(this.cd)} ${companyId}`))
    );
  }

  removeCampaignFromCompany(companyId: string, campaignId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteCampaignFromComponent(this.cd)} ${companyId} (campaignId=${campaignId}`);
    const url = `${this.companyUrl}/${companyId}/Campaigns/${campaignId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteCampaignFromComponent(this.cd)} ${campaignId} (campaignId=${campaignId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteCampaignFromComponent(this.cd)} ${companyId} (campaignId=${campaignId}`))
    );
  }

  addActionToCompany(companyId: string, action: Action): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putActionToComponent(this.cd)} ${companyId}`);
    const url = `${this.companyUrl}/${companyId}/Actions`;
    return this.http.put(url, action, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putActionToComponent(this.cd)} ${companyId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putActionToComponent(this.cd)} ${companyId}`))
    );
  }

  removeActionFromCompany(companyId: string, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteActionFromComponent(this.cd)} ${companyId} (actionId=${actionId}`);
    const url = `${this.companyUrl}/${companyId}/Actions/${actionId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteActionFromComponent(this.cd)} ${companyId} (actionId=${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteActionFromComponent(this.cd)} ${companyId} (actionId=${actionId}`))
    );
  }
}
