import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { AddressClassificationType } from '../classes/types/address-classification-type';

@Injectable()
export class CompanyAddressClassificationTypeService {

  results: string[];
  companyAddressClassificationTypeUrl = ServiceConstants.COMPANY_ADDRESS_CLASSIFICATION_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getCompanyAddressClassificationTypeList(): Observable<AddressClassificationType[]> {
    console.log('fetching companyAddressClassificationTypes');
    return this.http.get<AddressClassificationType[]>(this.companyAddressClassificationTypeUrl)
      .pipe(
        tap(companyAddressClassificationTypes => console.log(`fetched companyAddressClassificationTypes`)),
        catchError(this.handleError('getCompanyAddressClassificationTypeList', []))
      );
  }

  getCompany(id: string): Observable<AddressClassificationType> {
    console.log(`getting companyAddressClassificationType *${id}*`);
    const url = `${this.companyAddressClassificationTypeUrl}/${id}`;
    return this.http.get<AddressClassificationType>(url).pipe(
      tap(_ => console.log(`fetched companyAddressClassificationType id=${id}`)),
      catchError(this.handleError<AddressClassificationType>(`getCompany id=${id}`))
    );
  }

  addCompany(companyAddressClassificationType: AddressClassificationType): Observable<AddressClassificationType> {
    return null;
  }

  updateCompany(companyAddressClassificationType: AddressClassificationType): Observable<any> {
    return null;
  }

  closeCompany(id: string): Observable<any> {
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
