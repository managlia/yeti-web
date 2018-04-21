import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import * as rp from 'request-promise';
import { catchError, tap } from 'rxjs/operators';

import {Attachment} from '../classes/common/attachment';

import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';
import {Note} from '../classes/note';

@Injectable()
export class AttachmentService extends BaseService {


  fileUrl = ServiceConstants.FILE_URL;
  fileListUrl = ServiceConstants.FILE_LIST_URL;

  cd = 'file'; // 'componentDescription'

  getFileList(): Observable<Attachment[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Attachment[]>(this.fileListUrl, {
      headers: BaseService.headers} )
      .pipe(
        tap(files => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getFileListForEntity( entityType: string, entityId: string ): Observable<Attachment[]> {
    return this.getFileListByFilter(entityType, entityId);
  }

  getFileListByFilter(entityType: string, entityId: string): Observable<Attachment[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${entityId}`);
    const url = `${this.fileUrl}?entityType=${entityType}&entityId=${entityId}`;
    return this.http.get<Attachment[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(files => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${entityId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${entityId}`, []))
      );
  }

  getFile(id: string, contentType: string): Promise<any> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.fileUrl}/${id}`;

    const options = {
      method: 'GET',
      uri: url,
      encoding: null,
      headers: {
        'content-type': contentType
      },
      resolveWithFullResponse: true
    };
    return rp(options);
  }

  deleteFile(id: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteStatement(this.cd)} ${id}`);
    const url = `${this.fileUrl}/${id}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.deleteStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.deleteStatement(this.cd)} ${id}`))
      );
  }
}
