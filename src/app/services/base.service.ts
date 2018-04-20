import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {Observable} from 'rxjs/Observable';
// import * as colors from 'colors/safe';
import chalk from 'chalk';

@Injectable()
export class BaseService {

  static readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-TEST-EXTRA': 'ABC'
  });
  static readonly observeValue = 'response';
  static readonly responseTypeValue = 'text';

  getDescription = 'Getting';
  postDescription = 'Create new';
  putDescription = 'Update existing';
  deleteDescription = 'Delete existing';
  patchDescription = 'Batch update of';
  whoseId = 'whose id is';
  whoseFilter = 'whose filter is';
  foundOn = 'found on';
  P = 'PENDING:';
  S = 'SUCCESSFUL:';
  E = 'EXCEPTION:';
  U = 'UNSUPPORTED:';

  constructor(
    public http: HttpClient,
    public logger: LoggerService
  ) {
  }

  public handleError<T> (operation: string, result?: T) {
    return (error: any): Observable<T> => {
      this.logger.error(error);
      this.logger.error(`${operation} failed: ${error.message}`);

      // TODO: Distinguish between errors that should stop flow and those that should ask for retry.
      // Currently all errors are being passed up the the views that triggered the request. Not good for an outage.

      // return of(result as T);
      return error;
    };
  }

  public getAllStatement = (cd: string) => `${this.getDescription} all ${cd}s`;
  public getAllFilterStatement = (cd: string) => `${this.getDescription} all ${cd}s ${this.whoseFilter} `;
  public getOneStatement = (cd: string) => `${this.getDescription} one ${cd} ${this.whoseId} `;
  public postStatement = (cd: string) => `${this.postDescription} ${cd}  ${this.whoseId}  ${this.foundOn} `;
  public putStatement = (cd: string) => `${this.putDescription} one ${cd} ${this.whoseId} `;
  public deleteStatement = (cd: string) => `${this.deleteDescription} ${cd} ${this.whoseId} `;
  public patchStatement = (cd: string) => `${this.patchDescription} ${cd} ${this.whoseFilter} `;

  public putContactToComponent = (cd: string) => `${this.putDescription} CONTACT/ADDING TO ${cd} ${this.whoseId}`;
  public deleteContactFromComponent = (cd: string) => `${this.deleteDescription} CONTACT FROM ${cd} ${this.whoseId} `;
  public putCampaignToComponent = (cd: string) => `${this.putDescription} CAMPAIGN/ADDING TO ${cd} ${this.whoseId}`;
  public deleteCampaignFromComponent = (cd: string) => `${this.deleteDescription} CAMPAIGN FROM ${cd} ${this.whoseId} `;
  public putCompanyToComponent = (cd: string) => `${this.putDescription} COMPANY/ADDING TO ${cd} ${this.whoseId} `;
  public deleteCompanyFromComponent = (cd: string) => `${this.deleteDescription} COMPANY FROM ${cd} ${this.whoseId} `;
  public putActionToComponent = (cd: string) => `${this.putDescription} ACTION/ADDING TO ${cd} ${this.whoseId}`;
  public deleteActionFromComponent = (cd: string) => `${this.deleteDescription} ACTION FROM ${cd} ${this.whoseId} `;

}
