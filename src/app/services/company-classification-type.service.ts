import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { EntityClassificationType } from '../classes/types/entity-classification-type';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class CompanyClassificationTypeService extends BaseService {

  companyClassificationTypeUrl = ServiceConstants.COMPANY_CLASSIFICATION_TYPE_URL;
  cd = 'CompanyClassificationType'; // componentDescription

  getCompanyClassificationTypeList(): Observable<EntityClassificationType[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<EntityClassificationType[]>(this.companyClassificationTypeUrl, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getCompanyClassificationType(id: string): Observable<EntityClassificationType> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.companyClassificationTypeUrl}/${id}`;
    return this.http.get<EntityClassificationType>(url, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
    );
  }

}
