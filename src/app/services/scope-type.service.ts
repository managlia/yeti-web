import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { ScopeType } from '../classes/types/scope-type';

@Injectable()
export class ScopeTypeService {

  results: string[];
  scopeTypeUrl = ServiceConstants.SCOPE_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getScopeTypeList(): Observable<ScopeType[]> {
    console.log('fetching scopeTypes');
    return this.http.get<ScopeType[]>(this.scopeTypeUrl)
      .pipe(
        tap(scopeTypes => console.log(`fetched scopeTypes`)),
        catchError(this.handleError('getScopeTypeList', []))
      );
  }

  getScopeType(id: string): Observable<ScopeType> {
    console.log(`getting scopeType *${id}*`);
    const url = `${this.scopeTypeUrl}/${id}`;
    return this.http.get<ScopeType>(url).pipe(
      tap(_ => console.log(`fetched scopeType id=${id}`)),
      catchError(this.handleError<ScopeType>(`getCampaign id=${id}`))
    );
  }

  addCampaign(scopeType: ScopeType): Observable<ScopeType> {
    return null;
  }

  updateCampaign(scopeType: ScopeType): Observable<any> {
    return null;
  }

  closeCampaign(id: string): Observable<any> {
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
