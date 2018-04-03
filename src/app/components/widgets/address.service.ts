import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { AddressDetailsComponent } from './address-details/address-details.component';
import { Address } from '../../classes/common/address';
import { AddressClassificationType } from '../../classes/types/address-classification-type';

@Injectable()
export class AddressService {

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(address: Address, addressClassificationTypes: AddressClassificationType[]): Observable<Address> {
    const data = {
      address:  address,
      types: addressClassificationTypes
    };
    const dialogRef = this.dialog.open(AddressDetailsComponent, {
      width: '300px',
      height: '630px',
      data: data
    });

    return dialogRef.afterClosed();
  }
}
