import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/*
const baseOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-TEST-EXTRA': 'ABC'
  }),
  responseType: 'text' as 'json',
  observe: 'response'
};
*/

@Injectable()
export class BaseService {

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
      return of(result as T);
    };
  }

}
