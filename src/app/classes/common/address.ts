import {AddressClassificationType} from '../types/address-classification-type';

export class Address {
  addressId: string;
  address1: string;
  address2: string;
  city: string;
  countryId: string;
  postalCode: string;
  stateId: string;
  addressType: AddressClassificationType;
  createDate: Date;
  lastModifiedDate: Date;
  flaggedForDelete: boolean;

  constructor(
  ) {
    this.addressType = new AddressClassificationType();
  }
}
