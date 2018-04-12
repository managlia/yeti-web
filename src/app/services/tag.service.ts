import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { Tag } from '../classes/common/tag';
import { BaseService } from './base.service';
import { ServiceConstants } from '../service-constants';

@Injectable()
export class TagService extends BaseService {

  TagUrl = ServiceConstants.TAG_URL;
  cd = 'Tag'; // componentDescription

  getTagList(): Observable<Tag[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Tag[]>(this.TagUrl, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getTag(id: string): Observable<Tag> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.TagUrl}/${id}`;
    return this.http.get<Tag>(url, {
      headers: BaseService.headers})
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }
}
