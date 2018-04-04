import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { CampaignClassificationType } from '../classes/types/campaign-classification-type';
import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class CampaignClassificationTypeService extends BaseService {

  campaignClassificationTypeUrl = ServiceConstants.CAMPAIGN_CLASSIFICATION_TYPE_URL;
  cd = 'CampaignClassificationType';

  getCampaignClassificationTypeList(): Observable<CampaignClassificationType[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<CampaignClassificationType[]>(this.campaignClassificationTypeUrl, {
      headers: BaseService.headers} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getCampaignClassificationType(id: string): Observable<CampaignClassificationType> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.campaignClassificationTypeUrl}/${id}`;
    return this.http.get<CampaignClassificationType>(url, {
      headers: BaseService.headers})
    .pipe(
      tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
      catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
    );
  }
}
