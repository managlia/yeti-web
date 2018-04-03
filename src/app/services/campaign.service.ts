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
export class CampaignService {

  results: string[];
  campaignUrl = ServiceConstants.CAMPAIGN_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getCampaignList(): Observable<Campaign[]> {
    console.log('fetching campaigns');
    return this.http.get<Campaign[]>(this.campaignUrl)
      .pipe(
        tap(campaigns => console.log(`fetched campaigns`)),
        catchError(this.handleError('getCampaignList', []))
      );
  }

  getCampaignListByCompany(companyId: string): Observable<Campaign[]> {
    const filterId = 'companyId';
    return this.getCampaignListByFilter(companyId, filterId );
  }

  getCampaignListByAction(actionId: string): Observable<Campaign[]> {
    const filterId = 'actionId';
    return this.getCampaignListByFilter(actionId, filterId );
  }

  getCampaignListByContact(contactId: string): Observable<Campaign[]> {
    const filterId = 'contactId';
    return this.getCampaignListByFilter(contactId, filterId );
  }

  getCampaignListByFilter(filterId: string, filterKey: string): Observable<Campaign[]> {
    console.log(`getting campaigns with ${filterKey} *${filterId}*`);
    const url = `${this.campaignUrl}?${filterKey}=${filterId}`;
    return this.http.get<Campaign[]>(url)
      .pipe(
        tap(campaigns => console.log(`fetched campaigns using id ${filterId}`)),
        catchError(this.handleError('getCampaignListByFilter', []))
      );
  }

  getCampaign(id: string): Observable<Campaign> {
    console.log(`getting campaign with id *${id}*`);
    const url = `${this.campaignUrl}/${id}`;
    console.log(`calling *${url}*`);
    return this.http.get<Campaign>(url).pipe(
      tap(_ => console.log(`fetched campaign id=${id}`)),
      catchError(this.handleError<Campaign>(`getCampaign id=${id}`))
    );
  }

  addCampaign(campaign: Campaign): Observable<HttpResponse<any>> {
    return this.http.post(this.campaignUrl, campaign, { responseType: 'text', observe: 'response' }).pipe(
      tap( response  => console.log('created entity location: ', response.headers.get('Location') )  ),
      catchError(this.handleError<any>('addCampaign'))
    );
  }

  updateCampaign(campaign: Campaign): Observable<any> {
    const url = `${this.campaignUrl}/${campaign.campaignId}`;
    return this.http.put(url, campaign, httpOptions).pipe(
      tap(_ => console.log(`updated campaign id=${campaign.campaignId}`)),
      catchError(this.handleError<any>('updateCampaign'))
    );
  }

  addCampaignToContact(contact: Contact, campaignId: string): Observable<HttpResponse<any>> {
    const url = `${this.campaignUrl}/${campaignId}/Contacts`;
    return this.http.put(url, contact, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated campaign id=${campaignId}`)),
      catchError(this.handleError<any>('addCampaignToContact'))
    );
  }

  removeCampaignFromContact(contactId: string, campaignId: string): Observable<HttpResponse<any>> {
    const url = `${this.campaignUrl}/${campaignId}/Contacts/${contactId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`removed ${contactId} from campaign id=${campaignId}`)),
      catchError(this.handleError<any>('addCampaignToContact'))
    );
  }

  addCampaignToCompany(company: Company, campaignId: string): Observable<HttpResponse<any>> {
    const url = `${this.campaignUrl}/${campaignId}/Companies`;
    return this.http.put(url, company, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated campaign id=${campaignId}`)),
      catchError(this.handleError<any>('addCampaignToCompany'))
    );
  }

  removeCampaignFromCompany(companyId: string, campaignId: string): Observable<HttpResponse<any>> {
    const url = `${this.campaignUrl}/${campaignId}/Companies/${companyId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`removed ${companyId} from campaign id=${campaignId}`)),
      catchError(this.handleError<any>('addCampaignToCompany'))
    );
  }

  addCampaignToAction(action: Action, campaignId: string): Observable<HttpResponse<any>> {
    const url = `${this.campaignUrl}/${campaignId}/Actions`;
    return this.http.put(url, action, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`updated campaign id=${campaignId}`)),
      catchError(this.handleError<any>('addCampaignToCompany'))
    );
  }

  removeCampaignFromAction(actionId: string, campaignId: string): Observable<HttpResponse<any>> {
    const url = `${this.campaignUrl}/${campaignId}/Actions/${actionId}`;
    return this.http.delete(url, { responseType: 'text', observe: 'response' }).pipe(
      tap(_ => console.log(`removed ${actionId} from campaign id=${campaignId}`)),
      catchError(this.handleError<any>('addCampaignToCompany'))
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


