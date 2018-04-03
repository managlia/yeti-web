import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { UrlType } from '../classes/types/url-type';

@Injectable()
export class ContactUrlTypeService {

  results: string[];
  contactUrlTypeUrl = ServiceConstants.CONTACT_URL_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getUrlTypeList(): Observable<UrlType[]> {
    console.log('fetching contactUrlTypes');
    return this.http.get<UrlType[]>(this.contactUrlTypeUrl)
      .pipe(
        tap(contactUrlTypes => console.log(`fetched contactUrlTypes`)),
        catchError(this.handleError('getContactUrlTypeList', []))
      );
  }

  getUrlType(id: string): Observable<UrlType> {
    console.log(`getting contactUrlType *${id}*`);
    const url = `${this.contactUrlTypeUrl}/${id}`;
    return this.http.get<UrlType>(url).pipe(
      tap(_ => console.log(`fetched contactUrlType id=${id}`)),
      catchError(this.handleError<UrlType>(`getAction id=${id}`))
    );
  }

  addAUrlType(contactUrlType: UrlType): Observable<UrlType> {
    return null;
  }

  updateUrlType(contactUrlType: UrlType): Observable<any> {
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


