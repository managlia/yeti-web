import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { CompanyOrContact } from '../classes/common/company-or-contact';

@Injectable()
export class CompanyOrContactService {

  results: string[];
  companyOrContactUrl = ServiceConstants.COMPANY_OR_CONTACT_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  searchCompanyAndContact(term: string): Observable<CompanyOrContact[]> {
    const key = 'term';
    return this.doSearch( term, key );
  }

  searchCompany(term: string): Observable<CompanyOrContact[]> {
    const key = 'company';
    return this.doSearch( term, key );
  }

  searchContact(term: string): Observable<CompanyOrContact[]> {
    const key = 'contact';
    return this.doSearch( term, key );
  }

  doSearch(term: string, key: string): Observable<CompanyOrContact[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<CompanyOrContact[]>(`${this.companyOrContactUrl}/?${key}=${term}`)
      .pipe(
        tap(_ => console.log(`found company-or-contact matching "${term}"`)),
        catchError(this.handleError<CompanyOrContact[]>('searchHeroes', []))
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
