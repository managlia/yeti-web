import { Pipe, PipeTransform } from '@angular/core';
import {Contact} from '../contact';

@Pipe({
  name: 'recipientList'
})
export class RecipientListPipe implements PipeTransform {

  transform(contacts: Contact[]): any {
    let traversed = false;
    let nameList = '';
    contacts.map( e => {
      const prepend = traversed ? ', ' : '';
      nameList = nameList +  prepend + e.firstName + ' ' + e.lastName;
      console.log('nameList::: ' + nameList);
      traversed = true;
    });
    return nameList;
  }
}
