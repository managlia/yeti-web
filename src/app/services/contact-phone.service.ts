import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { Phone } from '../classes/common/phone';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class ContactPhoneService extends BaseService {

  contactPhonePhone = ServiceConstants.CONTACT_PHONE_URL;
  cd = 'ContactPhone'; // componentDescription

  getPhoneList(): Observable<Phone[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Phone[]>(this.contactPhonePhone, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getPhone(id: string): Observable<Phone> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const phone = `${this.contactPhonePhone}/${id}`;
    return this.http.get<Phone>(phone, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }
}
