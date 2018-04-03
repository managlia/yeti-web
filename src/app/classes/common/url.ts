import {UrlType} from '../types/url-type';

export class Url {
  urlId: string;
  urlType: UrlType;
  urlValue: string;
  description: string;

  constructor(
    urlId: string,
    urlType: UrlType,
    urlValue: string,
    description: string
  ) {
    this.urlId = urlId;
    this.urlType = urlType;
    this.urlValue = urlValue;
    this.description = description;
  }
}
