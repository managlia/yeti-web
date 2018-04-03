import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { CampaignOrAction } from '../classes/common/campaign-or-action';

@Injectable()
export class CampaignOrActionService {

  results: string[];
  campaignOrActionUrl = ServiceConstants.CAMPAIGN_OR_ACTION_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  searchCampaignAndAction(term: string): Observable<CampaignOrAction[]> {
    const key = 'term';
    return this.doSearch( term, key );
  }

  searchCampaign(term: string): Observable<CampaignOrAction[]> {
    const key = 'campaign';
    return this.doSearch( term, key );
  }

  searchAction(term: string): Observable<CampaignOrAction[]> {
    const key = 'action';
    return this.doSearch( term, key );
  }

  doSearch(term: string, key: string): Observable<CampaignOrAction[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<CampaignOrAction[]>(`${this.campaignOrActionUrl}/?${key}=${term}`)
      .pipe(
        tap(_ => console.log(`found campaign-or-action matching "${term}"`)),
        catchError(this.handleError<CampaignOrAction[]>('searchHeroes', []))
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
