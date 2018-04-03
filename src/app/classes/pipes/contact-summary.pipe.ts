import { Pipe, PipeTransform } from '@angular/core';
import {Contact} from '../contact';

@Pipe({
  name: 'contactSummary',
  pure: false
})
export class ContactSummaryPipe implements PipeTransform {

  transform(contact: Contact): string {
    let formattedString = '<b>' + contact.firstName + ' ' + contact.lastName + '</b><br>';
    formattedString += contact.titleType ? contact.titleType.name + '<br>' : '';
    formattedString += contact.contactEmailAddress ? contact.contactEmailAddress  : '';
    formattedString += contact.active ? '' + '' :  '<br>** INACTIVE CONTACT **';
    return formattedString;
  }
}
