import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { ActionClassificationType } from '../classes/types/action-classification-type';

@Injectable()
export class ActionClassificationTypeService {

  results: string[];
  actionClassificationTypeUrl = ServiceConstants.ACTION_CLASSIFICATION_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getActionClassificationTypeList(): Observable<ActionClassificationType[]> {
    console.log('fetching actionClassificationTypes');
    return this.http.get<ActionClassificationType[]>(this.actionClassificationTypeUrl)
      .pipe(
        tap(actionClassificationTypes => console.log(`fetched actionClassificationTypes`)),
        catchError(this.handleError('getActionClassificationTypeList', []))
      );
  }

  getAction(id: string): Observable<ActionClassificationType> {
    console.log(`getting actionClassificationType *${id}*`);
    const url = `${this.actionClassificationTypeUrl}/${id}`;
    return this.http.get<ActionClassificationType>(url).pipe(
      tap(_ => console.log(`fetched actionClassificationType id=${id}`)),
      catchError(this.handleError<ActionClassificationType>(`getAction id=${id}`))
    );
  }

  addAction(actionClassificationType: ActionClassificationType): Observable<ActionClassificationType> {
    return null;
  }

  updateAction(actionClassificationType: ActionClassificationType): Observable<any> {
    return null;
  }

  closeAction(id: string): Observable<any> {
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
