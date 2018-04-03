export class AddressClassificationType {
  constructor(
    addressTypeId: string,
    description: string,
    name: string,
  ) {
    this.addressTypeId = addressTypeId;
    this.description = description;
    this.name = name;
  }
  addressTypeId: string;
  description: string;
  name: string;
}
