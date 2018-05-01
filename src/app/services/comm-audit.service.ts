import { Injectable } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ServiceConstants} from '../service-constants';
import {catchError, tap} from 'rxjs/operators';
import {BaseService} from './base.service';
import {CommAudit} from '../classes/comms/comm-audit';

@Injectable()
export class CommAuditService extends BaseService {

  commAuditUrl = ServiceConstants.COMM_AUDIT_URL;

  cd = 'commAudit'; // 'componentDescription'

  updateAudit( commAudit: CommAudit ): Observable<HttpResponse<any>> {
    const id = commAudit.commId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.commAuditUrl}`;
    return this.http.post(url, commAudit, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
      );
  }

}
