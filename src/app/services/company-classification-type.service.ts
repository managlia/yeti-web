import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { EntityClassificationType } from '../classes/types/entity-classification-type';

@Injectable()
export class CompanyClassificationTypeService {

  results: string[];
  companyClassificationTypeUrl = ServiceConstants.COMPANY_CLASSIFICATION_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getCompanyClassificationTypeList(): Observable<EntityClassificationType[]> {
    console.log('fetching companyClassificationTypes');
    return this.http.get<EntityClassificationType[]>(this.companyClassificationTypeUrl)
      .pipe(
        tap(companyClassificationTypes => console.log(`fetched companyClassificationTypes`)),
        catchError(this.handleError('getCompanyClassificationTypeList', []))
      );
  }

  getCompany(id: string): Observable<EntityClassificationType> {
    console.log(`getting companyClassificationType *${id}*`);
    const url = `${this.companyClassificationTypeUrl}/${id}`;
    return this.http.get<EntityClassificationType>(url).pipe(
      tap(_ => console.log(`fetched companyClassificationType id=${id}`)),
      catchError(this.handleError<EntityClassificationType>(`getCompany id=${id}`))
    );
  }

  addCompany(companyClassificationType: EntityClassificationType): Observable<EntityClassificationType> {
    return null;
  }

  updateCompany(companyClassificationType: EntityClassificationType): Observable<any> {
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
