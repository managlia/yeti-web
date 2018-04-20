import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeConversion'
})
export class ActiveConversionPipe implements PipeTransform {

  transform(value: boolean): string {
    if ( value ) {
      return 'Open';
    } else {
      return 'Closed';
    }
  }
}
