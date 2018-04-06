import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import { AddressClassificationType } from '../../classes/types/address-classification-type';
import { Address } from '../../classes/common/address';
import { AddressService } from '../widgets/address.service';
import * as label from '../labels';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.css']
})
export class AddressCardComponent implements OnInit {

  @Input() addresses: Address[];
  @Input() addressTypes: AddressClassificationType[];
  @Output() addressesChangedInCard = new EventEmitter<Address[]>();
  public readonly label = label;
  addressesToModify: Address[];

  constructor(
    private addressService: AddressService,
  ) { }

  ngOnInit() {
    this.writeCopyFromOriginal();
  }

  writeCopyFromOriginal = () => this.addressesToModify = _.cloneDeep(this.addresses);

  openAddressDialog(anAddress: Address): void {
    if ( !anAddress ) {
      // Adding a new address
      this.addressService.openDialog(new Address(), this.addressTypes)
        .subscribe(result => {
          if ( result ) {
            this.addressesToModify.push(result);
            this.addresses.push(result);
            this.addressesChangedInCard.emit(this.addresses);
          }
        });
    } else {
      // Modifying an existing address
      const anAddressCopy = _.cloneDeep(anAddress);
      this.addressService.openDialog(anAddress, this.addressTypes)
        .subscribe( result => {
          if ( result ) {
            const foundInOriginalIndex = this.addresses.findIndex( e => e === anAddress );
            if ( foundInOriginalIndex < 0 ) {
              // dirtying a previously clean address - need to splice and populate with common reference
              const indexUsingId = this.addresses.findIndex( e => e.addressId === anAddress.addressId );
              this.addresses.splice(indexUsingId, 1, result);
            }
            anAddress = result;
            this.addressesChangedInCard.emit(this.addresses);
          }
      });
    }
  }

  flagForRemoval = (anAddress: Address)  => {
    anAddress.flaggedForDelete = true;
    let indexOfElement = this.addresses.findIndex( e => e === anAddress );
    if ( indexOfElement < 0 ) {
      indexOfElement = this.addresses.findIndex( e => e.addressId === anAddress.addressId );
    }
    this.addresses.splice(indexOfElement, 1);
    this.addressesChangedInCard.emit(this.addresses);
  }

  flagForRetention = (anAddress: Address)  => {
    anAddress.flaggedForDelete = false;
    this.addresses.push(anAddress);
    this.addressesChangedInCard.emit(this.addresses);
  }

}
