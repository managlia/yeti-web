import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import {Action} from '../classes/action';
import {Campaign} from '../classes/campaign';
import {Company} from '../classes/company';
import {Contact} from '../classes/contact';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CompanyService {

  results: string[];
  companyUrl = ServiceConstants.COMPANY_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getCompanyList(): Observable<Company[]> {
    console.log('fetching companies');
    return this.http.get<Company[]>(this.companyUrl)
      .pipe(
        tap(companies => console.log(`fetched companies`)),
        catchError(this.handleError('getCompanyList', []))
      );
  }
  getCompanyListByContact(contactId: string): Observable<Company[]> {
    const filterId = 'contactId';
    return this.getCompanyListByFilter(contactId, filterId );
  }

  getCompanyListByAction(actionId: string): Observable<Company[]> {
    const filterId = 'actionId';
    return this.getCompanyListByFilter(actionId, filterId );
  }

  getCompanyListByCampaign(campaignId: string): Observable<Company[]> {
    const filterId = 'campaignId';
    return this.getCompanyListByFilter(campaignId, filterId );
  }

  getCompanyListByFilter(filterId: string, filterKey: string): Observable<Company[]> {
    console.log(`getting companies with actionId *${filterId}*`);
    const url = `${this.companyUrl}?${filterKey}=${filterId}`;
    return this.http.get<Company[]>(url)
      .pipe(
        tap(companies => console.log(`fetched companies using id ${filterId}`)),
        catchError(this.handleError('getCompanyListByFilter', []))
      );
  }

  getCompany(id: string): Observable<Company> {
    console.log(`getting company with id *${id}*`);
    const url = `${this.companyUrl}/${id}`;
    console.log(`calling *${url}*`);
    return this.http.get<Company>(url).pipe(
      tap(_ => console.log(`fetched company id=${id}`)),
      catchError(this.handleError<Company>(`getCompany id=${id}`))
    );
  }

  addCompany(company: Company): Observable<HttpResponse<any>> {
    return this.http.post(this.companyUrl, company, { responseType: 'text', observe: 'response' }).pipe(
      tap( response  => console.log('created entity location: ', response.headers.get('Location') )  ),
      catchError(this.handleError<any>('addCompany'))
    );
  }

  updateCompany(company: Company): Observable<any> {
    const url = `${this.companyUrl}/${company.companyId}`;
    return this.http.put(url, company, httpOptions).pipe(
      tap(_ => console.log(`updated company id=${company.companyId}`)),
      catchError(this.handleError<any>('updateCompany'))
    );
  }

  addContactToCompany(companyId: string, contact: Contact): Observable<HttpResponse<any>> {
    const url = `${this.companyUrl}/${companyId}/Contacts`;
    return this.http.put(url, contact, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated company id=${companyId}`)),
      catchError(this.handleError<any>('addContactToCompany'))
    );
  }

  removeContactFromCompany(companyId: string, contactId: string): Observable<HttpResponse<any>> {
    const url = `${this.companyUrl}/${companyId}/Contacts/${contactId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`removed ${contactId} from copmany id=${companyId}`)),
      catchError(this.handleError<any>('removeContactFromCompany'))
    );
  }

  addCampaignToCompany(companyId: string, campaign: Campaign): Observable<HttpResponse<any>> {
    console.log('a');
    const url = `${this.companyUrl}/${companyId}/Campaigns`;
    return this.http.put(url, campaign, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated company id=${companyId}`)),
      catchError(this.handleError<any>('addCampaignToCompany'))
    );
  }

  removeCampaignFromCompany(companyId: string, campaignId: string): Observable<HttpResponse<any>> {
    console.log('b');
    const url = `${this.companyUrl}/${companyId}/Campaigns/${campaignId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`removed ${campaignId} from copmany id=${companyId}`)),
      catchError(this.handleError<any>('removeCampaignFromCompany'))
    );
  }

  addActionToCompany(companyId: string, action: Action): Observable<HttpResponse<any>> {
    console.log('c');
    const url = `${this.companyUrl}/${companyId}/Actions`;
    return this.http.put(url, action, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated company id=${companyId}`)),
      catchError(this.handleError<any>('addActionToCompany'))
    );
  }

  removeActionFromCompany(companyId: string, actionId: string): Observable<HttpResponse<any>> {
    console.log('d');
    const url = `${this.companyUrl}/${companyId}/Actions/${actionId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`removed ${actionId} from copmany id=${companyId}`)),
      catchError(this.handleError<any>('removeActionFromCompany'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log('dfm dfm dfm');
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}


