import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as countryData from 'country-data';
import * as us from 'us';
import * as _ from 'lodash';
import { AddressClassificationType } from '../../../classes/types/address-classification-type';


@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css']
})
export class AddressDetailsComponent implements OnInit {

  countries = countryData.countries.all;
  states = us.STATES;

  constructor(
    public dialogRef: MatDialogRef<AddressDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateAddressType(event): void {
    const selectedKey = event.value;
    const foundType: AddressClassificationType =  _.find(this.data.types, { 'addressTypeId': selectedKey });
    this.data.address.addressType = _.cloneDeep(foundType);
  }

  ngOnInit() {
    this.data.address.countryId = this.data.address.countryId ? this.data.address.countryId : 'US';
  }

}
