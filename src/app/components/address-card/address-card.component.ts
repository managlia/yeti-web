import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

import { AddressClassificationType } from '../../classes/types/address-classification-type';
import { Address } from '../../classes/common/address';
import { AddressService } from '../widgets/address.service';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.css']
})
export class AddressCardComponent implements OnInit {
  @Input() addresses: Address[];
  @Input() addressTypes: AddressClassificationType[];

  emptyAddress: Address = new Address(
    '',
    '',
    '',
    '',
    '',
    '',
    'US',
    new AddressClassificationType('', '', ''));

  constructor(
    private addressService: AddressService,
  ) { }

  ngOnInit() {
  }

  openAddressDialog(anAddress: Address): void {
    console.log('opening address dialog');
    if ( !anAddress ) {
      this.addressService.openDialog(_.cloneDeep(this.emptyAddress), this.addressTypes)
        .subscribe(result => ( result ? this.addresses.push(result) : null));
    } else {
      const anAddressCopy = _.cloneDeep(anAddress);
      this.addressService.openDialog(anAddress, this.addressTypes)
        .subscribe( result => ( result ? null : this.resetAddress(anAddressCopy, anAddress)) );
    }
  }

  resetAddress(replacementAddress: Address, originalAddress: Address) {
    originalAddress.address1 = replacementAddress.address1;
    originalAddress.address2 = replacementAddress.address2;
    originalAddress.city = replacementAddress.city;
    originalAddress.stateId = replacementAddress.stateId;
    originalAddress.countryId = replacementAddress.countryId;
    originalAddress.addressType = replacementAddress.addressType;
  }

  removeAddress(value): void {
    this.addresses.splice(this.addresses.indexOf(value), 1);
  }

}
