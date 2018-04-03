import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import {Email} from '../classes/email';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EmailService {

  results: string[];
  emailUrl = ServiceConstants.EXT_EMAIL_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getEmailList(): Observable<Email[]> {
    console.log('fetching emails');
    return this.http.get<Email[]>(this.emailUrl)
      .pipe(
        tap(emails => console.log(`fetched emails`)),
        catchError(this.handleError('getEmailList', []))
      );
  }

  getEmailListByFilter(filterId: string, filterKey: string): Observable<Email[]> {
    console.log(`getting emails with emailId *${filterId}*`);
    const url = `${this.emailUrl}?${filterKey}=${filterId}`;
    return this.http.get<Email[]>(url)
      .pipe(
        tap(emails => console.log(`fetched emails using id ${filterId}`)),
        catchError(this.handleError('getEmailListByFilter', []))
      );
  }

  getEmail(id: string): Observable<Email> {
    console.log(`getting email *${id}*`);
    const url = `${this.emailUrl}/${id}`;
    return this.http.get<Email>(url).pipe(
      tap(_ => console.log(`fetched email id=${id}`)),
      catchError(this.handleError<Email>(`getEmail id=${id}`))
    );
  }

  sendEmail(email: Email): Observable<HttpResponse<any>> {
    const simpleHeaders = { responseType: 'text', observe: 'response' };
    return this.http.post(this.emailUrl, email, { responseType: 'text', observe: 'response' }).pipe(
      tap( response  => console.log('created entity location: ', response.headers.get('Location') )  ),
      catchError(this.handleError<any>('addEmail'))
    );
  }

  updateEmail(email: Email): Observable<any> {
    const url = `${this.emailUrl}/${email.id}`;
    return this.http.put(url, email, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated email id=${email.id}`)),
      catchError(this.handleError<any>('updateEmail'))
    );
  }

  closeEmail(id: string): Observable<any> {
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





