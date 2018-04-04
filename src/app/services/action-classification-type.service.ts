import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { ActionClassificationType } from '../classes/types/action-classification-type';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class ActionClassificationTypeService extends BaseService {

  actionClassificationTypeUrl = ServiceConstants.ACTION_CLASSIFICATION_TYPE_URL;

  cd = 'actionClassificationTypeService';

  getActionClassificationTypeList(): Observable<ActionClassificationType[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<ActionClassificationType[]>(this.actionClassificationTypeUrl, {
      headers: BaseService.headers} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getActionClassificationType(id: string): Observable<ActionClassificationType> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.actionClassificationTypeUrl}/${id}`;
    return this.http.get<ActionClassificationType>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<ActionClassificationType>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }
}
