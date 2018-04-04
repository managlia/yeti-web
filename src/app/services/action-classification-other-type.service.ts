import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { ActionClassificationOtherType } from '../classes/types/action-classification-other-type';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class ActionClassificationOtherTypeService extends BaseService {

  actionClassificationOtherTypeUrl = ServiceConstants.ACTION_CLASSIFICATION_OTHER_TYPE_URL;

  cd = 'actionClassificationOtherTypeService';

  getActionClassificationOtherTypeList(): Observable<ActionClassificationOtherType[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<ActionClassificationOtherType[]>(this.actionClassificationOtherTypeUrl, {
      headers: BaseService.headers} )
      .pipe(
        tap(actions => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getActionClassificationOtherType(id: string): Observable<ActionClassificationOtherType> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.actionClassificationOtherTypeUrl}/${id}`;
    return this.http.get<ActionClassificationOtherType>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(result => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<ActionClassificationOtherType>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }
}
