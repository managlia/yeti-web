import { Pipe, PipeTransform } from '@angular/core';

import {Contact} from '../contact';
import * as tc from './text-constants';

@Pipe({
  name: 'contactEmailSummary'
})
export class ContactEmailSummaryPipe implements PipeTransform {

  transform(contact: Contact): string {
    let formattedString = '<b>' + contact.firstName + ' ' + contact.lastName + '</b> (' + contact.contactEmailAddress + ')';
    formattedString += contact.active ? '' + '' :  ' ** INACTIVE CONTACT ** ';
    return formattedString;
  }
}
