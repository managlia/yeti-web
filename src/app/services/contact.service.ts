import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Action} from '../classes/action';
import {Campaign} from '../classes/campaign';
import {Contact} from '../classes/contact';
import {Team} from '../classes/team';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class ContactService extends BaseService {

  contactUrl = ServiceConstants.CONTACT_URL;
  cd = 'Contact'; // componentDescription

  getContactList(): Observable<Contact[]> {
    console.log('fetching contacts');
    return this.http.get<Contact[]>(this.contactUrl, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
         catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
    );
  }

  getContactListByCompany(companyId: string): Observable<Contact[]> {
    const filterId = 'companyId';
    return this.getContactListByFilter(companyId, filterId );
  }

  getContactListByAction(actionId: string): Observable<Contact[]> {
    const filterId = 'actionId';
    return this.getContactListByFilter(actionId, filterId );
  }

  getContactListByTeam(teamId: string): Observable<Contact[]> {
    const filterId = 'teamId';
    return this.getContactListByFilter(teamId, filterId );
  }

  getContactListByCampaign(campaignId: string): Observable<Contact[]> {
    const filterId = 'campaignId';
    return this.getContactListByFilter(campaignId, filterId );
  }

  getContactListByFilter(filterId: string, filterKey: string): Observable<Contact[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${filterId}`);
    const url = `${this.contactUrl}?${filterKey}=${filterId}`;
    return this.http.get<Contact[]>(url, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${filterId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${filterId}`, []))
    );
  }

  getContact(id: string): Observable<Contact> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.contactUrl}/${id}`;
    return this.http.get<Contact>(url, {
      headers: BaseService.headers})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
    );
  }

  addContact(contact: Contact): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    return this.http.post(this.contactUrl, contact, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap( response  => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
      catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
    );
  }

  updateContact(contact: Contact): Observable<HttpResponse<any>> {
    const id = contact.contactId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.contactUrl}/${contact.contactId}`;
    return this.http.put(url, contact, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
    );
  }

  addCampaignToContact(contactId: string, campaign: Campaign): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putCampaignToComponent(this.cd)}${contactId}`);
    const url = `${this.contactUrl}/${contactId}/Campaigns`;
    return this.http.put(url, campaign, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putCampaignToComponent(this.cd)}${contactId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putCampaignToComponent(this.cd)} ${contactId}`))
    );
  }

  removeCampaignFromContact(contactId: string, campaignId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteCampaignFromComponent(this.cd)} ${contactId} (campaignId=${campaignId}`);
    const url = `${this.contactUrl}/${contactId}/Campaigns/${campaignId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteCampaignFromComponent(this.cd)} ${contactId} (campaignId=${campaignId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteCampaignFromComponent(this.cd)} ${contactId} (campaignId=${campaignId}`))
    );
  }

  addActionToContact(contactId: string, action: Action): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putActionToComponent(this.cd)} ${contactId}`);
    const url = `${this.contactUrl}/${contactId}/Actions`;
    return this.http.put(url, action, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.putActionToComponent(this.cd)} ${contactId}`)),
      catchError(this.handleError<any>(`${this.E}${this.putActionToComponent(this.cd)} ${contactId}`))
    );
  }

  removeActionFromContact(contactId: string, actionId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteActionFromComponent(this.cd)} ${contactId} (actionId=${actionId}`);
    const url = `${this.contactUrl}/${contactId}/Actions/${actionId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.deleteActionFromComponent(this.cd)} ${contactId} (actionId=${actionId}`)),
      catchError(this.handleError<any>(`${this.E}${this.deleteActionFromComponent(this.cd)} ${contactId} (actionId=${actionId}`))
    );
  }

  addTeamToContact(contactId: string, team: Team): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putTeamToComponent(this.cd)} ${contactId}`);
    const url = `${this.contactUrl}/${contactId}/Teams`;
    return this.http.put(url, team, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.putTeamToComponent(this.cd)} ${contactId}`)),
        catchError(this.handleError<any>(`${this.E}${this.putTeamToComponent(this.cd)} ${contactId}`))
      );
  }

  removeTeamFromContact(contactId: string, teamId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteTeamFromComponent(this.cd)} ${contactId} (teamId=${teamId}`);
    const url = `${this.contactUrl}/${contactId}/Teams/${teamId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.deleteTeamFromComponent(this.cd)} ${contactId} (teamId=${teamId}`)),
        catchError(this.handleError<any>(`${this.E}${this.deleteTeamFromComponent(this.cd)} ${contactId} (teamId=${teamId}`))
      );
  }


}
