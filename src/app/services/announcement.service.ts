import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Announcement} from '../classes/comms/announcement';

import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class AnnouncementService extends BaseService {

  announcementUrl = ServiceConstants.ANNOUNCEMENT_URL;

  cd = 'announcement'; // 'componentDescription'

  getOneEmailStatement = (cd: string) => `${cd} one EMAIL ${this.whoseId} `;

  getAnnouncementList(): Observable<Announcement[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Announcement[]>(this.announcementUrl, {
      headers: BaseService.headers} )
      .pipe(
        tap(announcements => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getAnnouncementListForEntity( entityType: string, entityId: string ): Observable<Announcement[]> {
    return this.getAnnouncementListByFilter(entityType, entityId);
  }

  getAnnouncementListByFilter(entityType: string, entityId: string): Observable<Announcement[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${entityId}`);
    const url = `${this.announcementUrl}?entityType=${entityType}&entityId=${entityId}`;
    return this.http.get<Announcement[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(announcements => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${entityId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${entityId}`, []))
      );
  }

  getAnnouncement(id: string): Observable<Announcement> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.announcementUrl}/${id}`;
    return this.http.get<Announcement>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(result => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<Announcement>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }

  addAnnouncement(announcement: Announcement): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    return this.http.post(this.announcementUrl, announcement, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(response => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
        catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
      );
  }

  updateAnnouncement(announcement: Announcement): Observable<HttpResponse<any>> {
    const id = announcement.announcementId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.announcementUrl}/${announcement.announcementId}`;
    return this.http.put(url, announcement, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
      );
  }

  deleteAnnouncement(id: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteStatement(this.cd)} ${id}`);
    const url = `${this.announcementUrl}/${id}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.deleteStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.deleteStatement(this.cd)} ${id}`))
      );
  }

  closeAnnouncement(id: string): Observable<any> {
    // TODO: implement patch for the close announcement
    this.logger.debug(`TODO:${this.patchStatement(this.cd)}`);
    return null;
  }
}
