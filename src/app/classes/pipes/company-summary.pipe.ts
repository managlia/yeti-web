import { Pipe, PipeTransform } from '@angular/core';

import {Company} from '../company';
import * as tc from './text-constants';

@Pipe({
  name: 'companySummary'
})
export class CompanySummaryPipe implements PipeTransform {

  transform = (company: Company) =>
    `${tc.htmlTags.boldStart}${company.name}${tc.htmlTags.boldEnd}${tc.space}(${company.classificationType.name})`;

}
