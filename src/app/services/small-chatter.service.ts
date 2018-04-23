import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import {Chatter} from '../classes/common/chatter';

import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class SmallChatterService extends BaseService {

  newsUrl = ServiceConstants.NEWS_URL;
  twitterUrl = ServiceConstants.TWITTER_URL;
  weatherUrl = ServiceConstants.WEATHER_URL;

  cd = 'chatter'; // 'componentDescription'

  getOneEmailStatement = (cd: string) => `${cd} one EMAIL ${this.whoseId} `;

  getNews(filterString: String): Observable<Chatter[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    const url = `${this.newsUrl}?filter=${filterString}`;
    return this.http.get<Chatter[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(chatters => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getTwitter(filterString: String): Observable<Chatter[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    const url = `${this.twitterUrl}?filter=${filterString}`;
    return this.http.get<Chatter[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(chatters => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getWeather(filterString: String[]): Observable<Chatter[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);

    let url = `${this.weatherUrl}`;
    let traversed = false;
    filterString.map( e => {
      const appendage = (traversed ? '&filter=' : '?filter=' ) + e;
      url = url + appendage;
      traversed = true;
    });

    return this.http.get<Chatter[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(chatters => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

}
