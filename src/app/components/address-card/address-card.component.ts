import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import * as _ from 'lodash';

import { AddressClassificationType } from '../../classes/types/address-classification-type';
import { Address } from '../../classes/common/address';
import { AddressService } from '../widgets/address.service';
import * as label from '../labels';
import {Observable} from 'rxjs/Observable';
import {CardComponent} from '../base/card/card.component';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.css']
})
export class AddressCardComponent extends CardComponent implements OnInit, OnChanges {

  @Input() addresses: Address[];
  @Input() addressTypes: AddressClassificationType[];
  @Output() addressesChangedInCard = new EventEmitter<Address[]>();
  public readonly label = label;
  addressesToModify: Address[];

  ngOnInit() {
    this.cardName = 'address';
    this.writeCopyFromOriginal();
    this.storePristineElements();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if ( changes.addresses && this.pristineElements ) {
      if ( _.differenceWith(changes.addresses.currentValue, this.pristineElements, _.isEqual).length === 0 ) {
        // exclusively for reset button on the parent
        this.addressesToModify = _.cloneDeep(this.pristineElements);
        this.cardIsDirty = false;
      }
    }
  }

  writeCopyFromOriginal = () => this.addressesToModify = _.cloneDeep(this.addresses);

  storePristineElements = () => this.pristineElements = _.cloneDeep(this.addresses);

  dirtyAndEmit = () => {
    this.cardIsDirty = true;
    this.addressesChangedInCard.emit(this.addresses);
    if ( !this.suspendedUndoEvent ) {
      this.suspendedUndoEvent = new Observable<any>(observer => {
        this.writeCopyFromOriginal();
        observer.next('undone');
        observer.complete();
        return {
          unsubscribe() {
          }
        };
      });
    }
    if ( !this.suspendedEvent ) {
      this.suspendedEvent = new Observable<any>(observer => {
        this.addresses = this.addresses.filter( e => !e.flaggedForDelete );
        this.writeCopyFromOriginal();
        observer.next('undone');
        observer.complete();
        return {
          unsubscribe() {
          }
        };
      });
    }
  };

  openAddressDialog(anAddress: Address): void {
    if ( !anAddress ) {
      // Adding a new address
      this.addressService.openDialog(new Address(), this.addressTypes)
        .subscribe(result => {
          if ( result ) {
            this.addressesToModify.push(result);
            this.addresses.push(result);
            this.dirtyAndEmit();
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
            this.dirtyAndEmit();
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
    this.dirtyAndEmit();
  }

  flagForRetention = (anAddress: Address)  => {
    anAddress.flaggedForDelete = false;
    this.addresses.push(anAddress);
    this.addressesChangedInCard.emit(this.addresses);
  }

}
