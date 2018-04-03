import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

  constructor() { }

  // TODO: Gotta implement more to loggging than just outputting to console.

  log = (logValue: any, objectValue?: any ) => {
    if ( objectValue ) {
      return console.log(logValue, objectValue);
    }
    return console.log(logValue);
  };

  debug = (logValue: any, objectValue?: any ) => {
    return this.log(logValue, objectValue);
  };

  error = (logValue: any, objectValue?: any ) => {
    if ( objectValue ) {
      return console.error(logValue, objectValue);
    }
    return console.error(logValue);
  };

}
