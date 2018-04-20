import { Injectable } from '@angular/core';
// import * as colors from 'colors/safe';
// import chalk from 'chalk';

const chalk = require('chalk');
const log = console.log;

@Injectable()
export class LoggerService {


  constructor() {
  }

  // TODO: Gotta implement more to loggging than just outputting to console.

  log = (logValue: any, objectValue?: any ) => {
    if ( objectValue ) {
      return log(chalk.blue(logValue), objectValue);
    }
    return log(chalk.green(logValue));
  };

  debug = (logValue: any, objectValue?: any ) => {
    return this.log(chalk.green(logValue), objectValue);
  };

  error = (logValue: any, objectValue?: any ) => {``
    if ( objectValue ) {
      return console.error(logValue, objectValue);
    }
    return console.error(logValue);
  };

}
