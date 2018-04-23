import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Action} from '../classes/action';
import {Campaign} from '../classes/campaign';
import {Team} from '../classes/team';
import {Contact} from '../classes/contact';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class TeamService extends BaseService {

  teamUrl = ServiceConstants.TEAM_URL;
  cd = 'Team'; // componentDescription

  getTeamList(): Observable<Team[]> {
    console.log('fetching teams');
    return this.http.get<Team[]>(this.teamUrl, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  searchTeam(filter: string): Observable<Team[]> {
    const filterId = 'filter';
    return this.getTeamListByFilter(filter, filterId );
  }

  getTeamListByContact(contactId: string): Observable<Team[]> {
    const filterId = 'contactId';
    return this.getTeamListByFilter(contactId, filterId );
  }

  getTeamListByFilter(filterId: string, filterKey: string): Observable<Team[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${filterId}`);
    const url = `${this.teamUrl}?${filterKey}=${filterId}`;
    return this.http.get<Team[]>(url, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${filterId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${filterId}`, []))
      );
  }

  getTeam(id: string): Observable<Team> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.teamUrl}/${id}`;
    return this.http.get<Team>(url, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }

  addTeam(team: Team): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    return this.http.post(this.teamUrl, team, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
      .pipe(
        tap( response  => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
        catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
      );
  }

  updateTeam(team: Team): Observable<HttpResponse<any>> {
    const id = team.teamId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.teamUrl}/${team.teamId}`;
    return this.http.put(url, team, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
      );
  }

  addContactToTeam(teamId: string, contact: Contact): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.putContactToComponent(this.cd)}${teamId}`);
    const url = `${this.teamUrl}/${teamId}/Contacts`;
    return this.http.put(url, contact, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.putContactToComponent(this.cd)}${teamId}`)),
        catchError(this.handleError<any>(`${this.E}${this.putContactToComponent(this.cd)} ${teamId}`))
      );
  }

  removeContactFromTeam(teamId: string, contactId: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteContactFromComponent(this.cd)} ${teamId} (contactId=${contactId}`);
    const url = `${this.teamUrl}/${teamId}/Contacts/${contactId}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.deleteContactFromComponent(this.cd)} ${teamId} (contactId=${contactId}`)),
        catchError(this.handleError<any>(`${this.E}${this.deleteContactFromComponent(this.cd)} ${teamId} (contactId=${contactId}`))
      );
  }
}
