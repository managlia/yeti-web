import {PhoneType} from '../types/phone-type';

export class Phone {
  phoneId: string;
  phoneType: PhoneType;
  phoneValue: string;
  description: string;

  constructor(
    phoneType: PhoneType,
    phoneValue: string,
    description: string
  ) {
    this.phoneType = phoneType;
    this.phoneValue = phoneValue;
    this.description = description;
  }
}
