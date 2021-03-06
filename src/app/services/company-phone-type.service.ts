import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { catchError, tap } from 'rxjs/operators';

import { PhoneType } from '../classes/types/phone-type';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class CompanyPhoneTypeService extends BaseService {

  companyPhoneTypePhone = ServiceConstants.COMPANY_PHONE_TYPE_URL;
  cd = 'CompanyPhoneType'; // componentDescription

  getPhoneTypeList(): Observable<PhoneType[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<PhoneType[]>(this.companyPhoneTypePhone, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getPhoneType(id: string): Observable<PhoneType> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const phone = `${this.companyPhoneTypePhone}/${id}`;
    return this.http.get<PhoneType>(phone, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }
}
