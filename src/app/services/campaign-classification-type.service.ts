import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';

import {ServiceConstants} from '../service-constants';
import { CampaignClassificationType } from '../classes/types/campaign-classification-type';

@Injectable()
export class CampaignClassificationTypeService {

  results: string[];
  campaignClassificationTypeUrl = ServiceConstants.CAMPAIGN_CLASSIFICATION_TYPE_URL;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService
  ) { }

  getCampaignClassificationTypeList(): Observable<CampaignClassificationType[]> {
    console.log('fetching campaignClassificationTypes');
    return this.http.get<CampaignClassificationType[]>(this.campaignClassificationTypeUrl)
      .pipe(
        tap(campaignClassificationTypes => console.log(`fetched campaignClassificationTypes`)),
        catchError(this.handleError('getCampaignClassificationTypeList', []))
      );
  }

  getCampaignClassificationType(id: string): Observable<CampaignClassificationType> {
    console.log(`getting campaignClassificationType *${id}*`);
    const url = `${this.campaignClassificationTypeUrl}/${id}`;
    return this.http.get<CampaignClassificationType>(url).pipe(
      tap(_ => console.log(`fetched campaignClassificationType id=${id}`)),
      catchError(this.handleError<CampaignClassificationType>(`getCampaign id=${id}`))
    );
  }

  addCampaign(campaignClassificationType: CampaignClassificationType): Observable<CampaignClassificationType> {
    return null;
  }

  updateCampaign(campaignClassificationType: CampaignClassificationType): Observable<any> {
    return null;
  }

  closeCampaign(id: string): Observable<any> {
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
