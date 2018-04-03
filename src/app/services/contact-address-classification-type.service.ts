import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { AddressClassificationType } from '../classes/types/address-classification-type';

@Injectable()
export class ContactAddressClassificationTypeService {

  results: string[];
  contactAddressClassificationTypeUrl = ServiceConstants.CONTACT_ADDRESS_CLASSIFICATION_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getContactAddressClassificationTypeList(): Observable<AddressClassificationType[]> {
    console.log('fetching contactAddressClassificationTypes');
    return this.http.get<AddressClassificationType[]>(this.contactAddressClassificationTypeUrl)
      .pipe(
        tap(contactAddressClassificationTypes => console.log(`fetched contactAddressClassificationTypes`)),
        catchError(this.handleError('getContactAddressClassificationTypeList', []))
      );
  }

  getContact(id: string): Observable<AddressClassificationType> {
    console.log(`getting contactAddressClassificationType *${id}*`);
    const url = `${this.contactAddressClassificationTypeUrl}/${id}`;
    return this.http.get<AddressClassificationType>(url).pipe(
      tap(_ => console.log(`fetched contactAddressClassificationType id=${id}`)),
      catchError(this.handleError<AddressClassificationType>(`getContact id=${id}`))
    );
  }

  addContact(contactAddressClassificationType: AddressClassificationType): Observable<AddressClassificationType> {
    return null;
  }

  updateContact(contactAddressClassificationType: AddressClassificationType): Observable<any> {
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
