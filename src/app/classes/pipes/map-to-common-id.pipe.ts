import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToCommonId'
})
export class MapToCommonIdPipe implements PipeTransform {

  transform(value: any, uniqueId: any): any {
    value.id = uniqueId;
    return value;
  }
}
