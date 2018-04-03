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

  constructor(
    addressId: string,
    address1: string,
    address2: string,
    city: string,
    stateId: string,
    postalCode: string,
    countryId: string,
    addressType: AddressClassificationType
  ) {
    this.addressId = addressId;
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.stateId = stateId;
    this.postalCode = postalCode;
    this.countryId = countryId;
    this.addressType = addressType;
  }
}
