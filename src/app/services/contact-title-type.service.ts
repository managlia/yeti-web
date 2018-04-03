import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { ContactTitleType } from '../classes/types/contact-title-type';

@Injectable()
export class ContactTitleTypeService {

  results: string[];
  contactTitleTypeUrl = ServiceConstants.CONTACT_TITLE_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getTitleTypeList(): Observable<ContactTitleType[]> {
    console.log('fetching contactTitleTypes');
    return this.http.get<ContactTitleType[]>(this.contactTitleTypeUrl)
      .pipe(
        tap(contactTitleTypes => console.log(`fetched contactTitleTypes`)),
        catchError(this.handleError('getContactTitleTypeList', []))
      );
  }

  getTitleType(id: string): Observable<ContactTitleType> {
    console.log(`getting contactTitleType *${id}*`);
    const url = `${this.contactTitleTypeUrl}/${id}`;
    return this.http.get<ContactTitleType>(url).pipe(
      tap(_ => console.log(`fetched contactTitleType id=${id}`)),
      catchError(this.handleError<ContactTitleType>(`getTitleType id=${id}`))
    );
  }

  addATitleType(contactTitleType: ContactTitleType): Observable<ContactTitleType> {
    return null;
  }

  updateTitleType(contactTitleType: ContactTitleType): Observable<any> {
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


