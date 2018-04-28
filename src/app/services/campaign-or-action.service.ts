import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { CampaignOrAction } from '../classes/common/campaign-or-action';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class CampaignOrActionService extends BaseService {

  campaignOrActionUrl = ServiceConstants.CAMPAIGN_OR_ACTION_URL;
  cd = 'CampaignOrAction';
  getFilterStatement = (cd: string) => `${this.getDescription} all ${cd}s ${this.whoseFilter} `;

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
    this.logger.debug(`${this.P}${this.getFilterStatement(this.cd)}${key} === "${term}"`);
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<CampaignOrAction[]>(`${this.campaignOrActionUrl}/?${key}=${term}`, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getFilterStatement(this.cd)}${key} === "${term}"`)),
        catchError(this.handleError<any>(`${this.E}${this.getFilterStatement(this.cd)}${key} === "${term}"`))
      );
  }
}
