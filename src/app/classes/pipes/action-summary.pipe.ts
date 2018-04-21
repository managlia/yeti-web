import { Pipe, PipeTransform } from '@angular/core';
import * as tc from './text-constants';

import {Action} from '../action';

@Pipe({
  name: 'actionSummary'
})
export class ActionSummaryPipe implements PipeTransform {

  transform(action: Action): any {
    return `${tc.htmlTags.boldStart}${action.name}${tc.htmlTags.boldEnd}${tc.space}(${action.classificationType.name})`;
  }

}
