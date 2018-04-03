import { Pipe, PipeTransform } from '@angular/core';
import {Company} from '../company';

@Pipe({
  name: 'companySummary'
})
export class CompanySummaryPipe implements PipeTransform {

  transform(company: Company): string {
    const formattedString = '<b>' + company.name + '</b> (' + company.classificationType.name + ')';
    return formattedString;
  }
}
