import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { AddressClassificationType } from '../classes/types/address-classification-type';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class CompanyAddressClassificationTypeService extends BaseService {

  companyAddressClassificationTypeUrl = ServiceConstants.COMPANY_ADDRESS_CLASSIFICATION_TYPE_URL;
  cd = 'CompanyAddressClassificationType'; // componentDescription

  getCompanyAddressClassificationTypeList(): Observable<AddressClassificationType[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<AddressClassificationType[]>(this.companyAddressClassificationTypeUrl, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getCompanyAddressClassificationType(id: string): Observable<AddressClassificationType> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.companyAddressClassificationTypeUrl}/${id}`;
    return this.http.get<AddressClassificationType>(url, {
      headers: BaseService.headers})
    .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
    );
  }
}
