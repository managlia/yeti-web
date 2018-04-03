import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeConversion'
})
export class ActiveConversionPipe implements PipeTransform {

  transform(value: boolean): string {
    console.log('value: ' + value);
    if ( value ) {
      return 'Open';
    } else {
      return 'Closed';
    }
  }

}
