import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { ActionClassificationOtherType } from '../classes/types/action-classification-other-type';

@Injectable()
export class ActionClassificationOtherTypeService {

  results: string[];
  actionClassificationOtherTypeUrl = ServiceConstants.ACTION_CLASSIFICATION_OTHER_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getActionClassificationOtherTypeList(): Observable<ActionClassificationOtherType[]> {
    console.log('fetching actionClassificationOtherTypes');
    return this.http.get<ActionClassificationOtherType[]>(this.actionClassificationOtherTypeUrl)
      .pipe(
        tap(actionClassificationOtherTypes => console.log(`fetched actionClassificationOtherTypes`)),
        catchError(this.handleError('getActionClassificationOtherTypeList', []))
      );
  }

  getAction(id: string): Observable<ActionClassificationOtherType> {
    console.log(`getting actionClassificationOtherType *${id}*`);
    const url = `${this.actionClassificationOtherTypeUrl}/${id}`;
    return this.http.get<ActionClassificationOtherType>(url).pipe(
      tap(_ => console.log(`fetched actionClassificationOtherType id=${id}`)),
      catchError(this.handleError<ActionClassificationOtherType>(`getAction id=${id}`))
    );
  }

  addAction(actionClassificationOtherType: ActionClassificationOtherType): Observable<ActionClassificationOtherType> {
    return null;
  }

  updateAction(actionClassificationOtherType: ActionClassificationOtherType): Observable<any> {
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
