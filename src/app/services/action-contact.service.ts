import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';

@Injectable()
export class ActionContactService {

  results: string[];
  actionContactUrl = ServiceConstants.ACTION_CONTACT_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getActionContactByContactId(contactId: string): Observable<any[]> {
    console.log('fetching actionContacts');
    return this.http.get<any[]>(`${this.actionContactUrl}/contactId=${contactId}`)
      .pipe(
        tap(actionContacts => console.log(`fetched actionContacts`)),
        catchError(this.handleError('getActionContactList', []))
      );
  }

  getActionContactByActionId(actionId: string): Observable<any[]> {
    console.log('fetching actionContacts');
    return this.http.get<any[]>(`${this.actionContactUrl}/actionId=${actionId}`)
      .pipe(
        tap(actionContacts => console.log(`fetched actionContacts`)),
        catchError(this.handleError('getActionContactList', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
