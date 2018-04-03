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
export class ContactService {

  results: string[];
  contactUrl = ServiceConstants.CONTACT_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getContactList(): Observable<Contact[]> {
    console.log('fetching contacts');
    return this.http.get<Contact[]>(this.contactUrl)
      .pipe(
        tap(contacts => console.log(`fetched contacts`)),
        catchError(this.handleError('getContactList', []))
      );
  }

  getContactListByCompany(companyId: string): Observable<Contact[]> {
    const filterId = 'companyId';
    return this.getContactListByFilter(companyId, filterId );
  }

  getContactListByAction(actionId: string): Observable<Contact[]> {
    const filterId = 'actionId';
    return this.getContactListByFilter(actionId, filterId );
  }

  getContactListByCampaign(campaignId: string): Observable<Contact[]> {
    const filterId = 'campaignId';
    return this.getContactListByFilter(campaignId, filterId );
  }

  getContactListByFilter(filterId: string, filterKey: string): Observable<Contact[]> {
    console.log(`getting contacts with actionId *${filterId}*`);
    const url = `${this.contactUrl}?${filterKey}=${filterId}`;
    return this.http.get<Contact[]>(url)
      .pipe(
        tap(contacts => console.log(`fetched contacts using id ${filterId}`)),
        catchError(this.handleError('getContactListByFilter', []))
      );
  }

  getContact(id: string): Observable<Contact> {
    console.log(`getting contact with id *${id}*`);
    const url = `${this.contactUrl}/${id}`;
    console.log(`calling *${url}*`);
    return this.http.get<Contact>(url).pipe(
      tap(_ => console.log(`fetched contact id=${id}`)),
      catchError(this.handleError<Contact>(`getContact id=${id}`))
    );
  }

  addContact(contact: Contact): Observable<HttpResponse<any>> {
    return this.http.post(this.contactUrl, contact, { responseType: 'text', observe: 'response' }).pipe(
      tap( response  => console.log('created entity location: ', response.headers.get('Location') )  ),
      catchError(this.handleError<any>('addContact'))
    );
  }

  updateContact(contact: Contact): Observable<HttpResponse<any>> {
    const url = `${this.contactUrl}/${contact.contactId}`;
    return this.http.put(url, contact, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated contact id=${contact.contactId}`)),
      catchError(this.handleError<any>('updateContact'))
    );
  }

  addCampaignToContact(contactId: string, campaign: Campaign): Observable<HttpResponse<any>> {
    const url = `${this.contactUrl}/${contactId}/Campaigns`;
    return this.http.put(url, campaign, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated contact id=${contactId}`)),
      catchError(this.handleError<any>('addCampaignToContact'))
    );
  }

  removeCampaignFromContact(contactId: string, campaignId: string): Observable<HttpResponse<any>> {
    const url = `${this.contactUrl}/${contactId}/Campaigns/${campaignId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`removed ${campaignId} from copmany id=${contactId}`)),
      catchError(this.handleError<any>('removeCampaignFromContact'))
    );
  }

  addActionToContact(contactId: string, action: Action): Observable<HttpResponse<any>> {
    const url = `${this.contactUrl}/${contactId}/Actions`;
    return this.http.put(url, action, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated contact id=${contactId}`)),
      catchError(this.handleError<any>('addActionToContact'))
    );
  }

  removeActionFromContact(contactId: string, actionId: string): Observable<HttpResponse<any>> {
    const url = `${this.contactUrl}/${contactId}/Actions/${actionId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`removed ${actionId} from copmany id=${contactId}`)),
      catchError(this.handleError<any>('removeActionFromContact'))
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


