import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { EntityClassificationType } from '../classes/types/entity-classification-type';

@Injectable()
export class ContactClassificationTypeService {

  results: string[];
  contactClassificationTypeUrl = ServiceConstants.CONTACT_CLASSIFICATION_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getContactClassificationTypeList(): Observable<EntityClassificationType[]> {
    console.log('fetching contactClassificationTypes');
    return this.http.get<EntityClassificationType[]>(this.contactClassificationTypeUrl)
      .pipe(
        tap(contactClassificationTypes => console.log(`fetched contactClassificationTypes`)),
        catchError(this.handleError('getContactClassificationTypeList', []))
      );
  }

  getContact(id: string): Observable<EntityClassificationType> {
    console.log(`getting contactClassificationType *${id}*`);
    const url = `${this.contactClassificationTypeUrl}/${id}`;
    return this.http.get<EntityClassificationType>(url).pipe(
      tap(_ => console.log(`fetched contactClassificationType id=${id}`)),
      catchError(this.handleError<EntityClassificationType>(`getContact id=${id}`))
    );
  }

  addContact(contactClassificationType: EntityClassificationType): Observable<EntityClassificationType> {
    return null;
  }

  updateContact(contactClassificationType: EntityClassificationType): Observable<any> {
    return null;
  }

  closeContact(id: string): Observable<any> {
    return null;
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
