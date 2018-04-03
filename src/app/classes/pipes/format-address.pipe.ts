import { Pipe, PipeTransform } from '@angular/core';
import {Address} from '../common/address';

@Pipe({
  name: 'formatAddress',
  pure: false
})
export class FormatAddressPipe implements PipeTransform {

  formattedString: string;

  transform(address: Address): string {
    this.formattedString = '<b>' + (address.addressType ? address.addressType.name : '') + '</b><br>';
    this.formattedString += address.address1 ? address.address1 + '<br>' : '';
    this.formattedString += address.address2 ? address.address2 + '<br>' : '';
    this.formattedString += address.city ? address.city + ' ' : '';
    this.formattedString += address.stateId ? address.stateId + ' ' : '';
    this.formattedString += address.postalCode ? address.postalCode : '';
    return this.formattedString;
  }
}
