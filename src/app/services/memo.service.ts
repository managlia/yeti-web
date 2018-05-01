import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Memo} from '../classes/comms/memo';

import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class MemoService extends BaseService {

  memoUrl = ServiceConstants.MEMO_URL;
  commsUrl = ServiceConstants.COMMS_URL;

  cd = 'memo'; // 'componentDescription'

  getOneEmailStatement = (cd: string) => `${cd} one EMAIL ${this.whoseId} `;

  getMemoList(): Observable<Memo[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Memo[]>(this.commsUrl, {
      headers: BaseService.headers} )
      .pipe(
        tap(memos => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getMemoListForEntity( entityType: string, entityId: string ): Observable<Memo[]> {
    return this.getMemoListByFilter(entityType, entityId);
  }

  getMemoListByFilter(entityType: string, entityId: string): Observable<Memo[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${entityId}`);
    const url = `${this.memoUrl}?entityType=${entityType}&entityId=${entityId}`;
    return this.http.get<Memo[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(memos => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${entityId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${entityId}`, []))
      );
  }

  getMemo(id: string): Observable<Memo> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.memoUrl}/${id}`;
    return this.http.get<Memo>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(result => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<Memo>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }

  addMemo(memo: Memo): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    return this.http.post(this.memoUrl, memo, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(response => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
        catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
      );
  }

  updateMemo(memo: Memo): Observable<HttpResponse<any>> {
    const id = memo.memoId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.memoUrl}/${memo.memoId}`;
    return this.http.put(url, memo, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
      );
  }

  deleteMemo(id: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteStatement(this.cd)} ${id}`);
    const url = `${this.memoUrl}/${id}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.deleteStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.deleteStatement(this.cd)} ${id}`))
      );
  }

  closeMemo(id: string): Observable<any> {
    // TODO: implement patch for the close memo
    this.logger.debug(`TODO:${this.patchStatement(this.cd)}`);
    return null;
  }
}
