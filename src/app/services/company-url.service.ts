import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { Url } from '../classes/common/url';

@Injectable()
export class CompanyUrlService {

  results: string[];
  companyUrlUrl = ServiceConstants.COMPANY_URL_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getUrlList(): Observable<Url[]> {
    console.log('fetching companyUrls');
    return this.http.get<Url[]>(this.companyUrlUrl)
      .pipe(
        tap(companyUrls => console.log(`fetched companyUrls`)),
        catchError(this.handleError('getCompanyUrlList', []))
      );
  }

  getUrl(id: string): Observable<Url> {
    console.log(`getting companyUrl *${id}*`);
    const url = `${this.companyUrlUrl}/${id}`;
    return this.http.get<Url>(url).pipe(
      tap(_ => console.log(`fetched companyUrl id=${id}`)),
      catchError(this.handleError<Url>(`getAction id=${id}`))
    );
  }

  addAUrl(companyUrl: Url): Observable<Url> {
    return null;
  }

  updateUrl(companyUrl: Url): Observable<any> {
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


