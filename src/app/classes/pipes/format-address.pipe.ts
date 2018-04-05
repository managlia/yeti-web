import { Pipe, PipeTransform } from '@angular/core';
import {Address} from '../common/address';
import * as tc from './text-constants';

@Pipe({
  name: 'formatAddress',
  pure: false
})
export class FormatAddressPipe implements PipeTransform {

  formattedString: string;

  transform(a: Address): string {
    this.formattedString = tc.htmlTags.boldStart + (a.addressType ? a.addressType.name : '') + tc.htmlTags.boldEnd + tc.htmlTags.break;
    this.formattedString += a.address1 ? a.address1 + tc.htmlTags.break : '';
    this.formattedString += a.address2 ? a.address2 + tc.htmlTags.break : '';
    this.formattedString += a.city ? a.city + tc.space : '';
    this.formattedString += a.stateId ? a.stateId + tc.space : '';
    this.formattedString += a.postalCode ? a.postalCode : '';
    return this.formattedString;
  }
}
