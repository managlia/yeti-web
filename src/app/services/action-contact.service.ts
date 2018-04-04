import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';
import {ActionClassificationType} from '../classes/types/action-classification-type';

@Injectable()
export class ActionContactService extends BaseService {

  results: string[];
  actionContactUrl = ServiceConstants.ACTION_CONTACT_URL;

  componentDescription = 'actionContact';
  getActionContactByContactIdStatement = `${this.getDescription} ${this.componentDescription} using contactId == `;
  getActionContactByActionIdStatement = `${this.getDescription} ${this.componentDescription} using actionId ==  `;

  getActionContactByContactId(contactId: string): Observable<any[]> {
    this.logger.debug(`${this.P}${this.getActionContactByContactIdStatement}${contactId}`);
    return this.http.get<any[]>(`${this.actionContactUrl}/contactId=${contactId}`)
      .pipe(
        tap(actionContacts => this.logger.debug(`${this.S}${this.getActionContactByContactIdStatement}${contactId}`)),
        catchError(this.handleError(`${this.E}${this.getActionContactByContactIdStatement}${contactId}`, []))
      );
  }

  getActionContactByActionId(actionId: string): Observable<any[]> {
    this.logger.debug(`${this.P}${this.getActionContactByActionIdStatement}${actionId}`);
    return this.http.get<any[]>(`${this.actionContactUrl}/actionId=${actionId}`)
      .pipe(
        tap(actionContacts => this.logger.debug(`${this.S}${this.getActionContactByActionIdStatement}${actionId}`)),
        catchError(this.handleError(`${this.E}${this.getActionContactByActionIdStatement}${actionId}`, []))
      );
  }
}
