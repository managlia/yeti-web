import {Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Phone} from '../../../classes/common/phone';
// import * as phoneFormatter from 'phone-formatter';
// import { parse, format, AsYouType } from 'libphonenumber-js';

import * as phone from 'libphonenumber-js';


@Component({
  selector: 'app-phone-details',
  templateUrl: './phone-details.component.html',
  styleUrls: ['./phone-details.component.scss']
})
export class PhoneDetailsComponent implements OnInit {
  phoneForm: FormGroup;
  // asYouType: AsYouType = new AsYouType();

  constructor(
    public dialogRef: MatDialogRef<PhoneDetailsComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.phoneForm = this.formBuilder.group({
      items: this.formBuilder.array(this.loadItems())
    });
  }

  addItem(): FormGroup {
    return this.formBuilder.group({
      typeControl: ['', Validators.required],
      valueControl: [
        '', this.phoneValidator()
      ],
      descriptionControl: ''
    });
  }

  discontinueAdd = () => this.phoneForm.get('items').value.length === this.data.types.length;

  isPhoneInvalid = () => true;

  getOptions = (index) => {
    const items = this.phoneForm.get('items').value;
    const seenKeys = items.slice(0, index).map( e => e.typeControl );
    const filteredArray = this.data.types.filter( (e) => !seenKeys.includes(e.phoneTypeId));
    return filteredArray;
  }

  phoneValidator = () => {
    return Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25)
      // ,
      // Validators.pattern( '^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$'  )
    ])
  };

  loadItems(): FormGroup[] {
    if ( this.data.phones && this.data.phones.length > 0 ) {
      const newArray = this.data.phones.map(aPhone => {
        const newPhone = this.formBuilder.group({
          typeControl: [aPhone.phoneType.phoneTypeId,  Validators.required],
          valueControl: [aPhone.phoneValue, this.phoneValidator()],
          descriptionControl: [aPhone.description]
        });
        return newPhone;
      });
      return newArray;
    } else {
      return [ this.addItem() ];
    }
  }

  considerReformat = (theGroup: any) => {
    const item = theGroup as FormGroup;
    const updatedValue = phone.formatNumber( item.value.valueControl, 'US', 'National' );
    item.patchValue( {valueControl: updatedValue} );
  };

  removePhone(index): void {
    const items = this.phoneForm.get('items') as FormArray;
    items.removeAt(index);
  }

  addPhone(): void {
    const items = this.phoneForm.get('items') as FormArray;
    items.push(this.addItem());
  }

  getTypeById = (id: string) => this.data.types.filter( e => e.phoneTypeId === id)[0];

  processDone(): void {
    if ( this.phoneForm.valid ) {
      const updatedItems = this.phoneForm.get('items').value;
      const newData = updatedItems.map( anItem => new Phone(
        this.getTypeById(
          anItem.typeControl),
          anItem.valueControl,
          anItem.descriptionControl
      ));
      this.dialogRef.close(newData);
    }
  }

  closeWithoutSaving(): void {
    this.dialogRef.close();
  }
}
