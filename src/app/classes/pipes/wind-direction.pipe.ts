import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'windDirection'
})
export class WindDirectionPipe implements PipeTransform {

  transform(value: number): any {
    const d  = (value - 11.25) / 22.5;
    if( d < 0 ) {
      return 'N';
    } else if ( d < 1) {
      return 'NNE';
    } else if ( d < 2) {
      return 'NE';
    } else if ( d < 3) {
      return 'ENE';
    } else if ( d < 4) {
      return 'E';
    } else if ( d < 5) {
      return 'ESE';
    } else if ( d < 6) {
      return 'SE';
    } else if ( d < 7) {
      return 'SSE';
    } else if ( d < 8) {
      return 'S';
    } else if ( d < 9) {
      return 'SSW';
    } else if ( d < 10) {
      return 'SW';
    } else if ( d < 11) {
      return 'WSS';
    } else if ( d < 12) {
      return 'W';
    } else if ( d < 13) {
      return 'WNW';
    } else if ( d < 14) {
      return 'NW';
    } else {
      return 'NNW';
    }
  }

}
