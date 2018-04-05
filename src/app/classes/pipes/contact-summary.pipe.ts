import { Pipe, PipeTransform } from '@angular/core';
import {Contact} from '../contact';
import * as tc from './text-constants';

@Pipe({
  name: 'contactSummary',
  pure: false
})
export class ContactSummaryPipe implements PipeTransform {

  transform = (contact: Contact) => {
    let formattedString = tc.htmlTags.boldStart + contact.firstName + ' ' + contact.lastName + tc.htmlTags.boldStart + tc.htmlTags.break;
    formattedString += contact.titleType ? contact.titleType.name + tc.htmlTags.break : '';
    formattedString += contact.contactEmailAddress ? contact.contactEmailAddress  : '';
    formattedString += contact.active ? '' + '' :  tc.htmlTags.break + tc.contact.inactiveIndicator;
    return formattedString;
  }
}
