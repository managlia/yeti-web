import {Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Url} from '../../../classes/common/url';
import {UrlType} from '../../../classes/types/url-type';

@Component({
  selector: 'app-url-details',
  templateUrl: './url-details.component.html',
  styleUrls: ['./url-details.component.css']
})
export class UrlDetailsComponent implements OnInit {
  urlForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UrlDetailsComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.urlForm = this.formBuilder.group({
      items: this.formBuilder.array(this.loadItems())
    });
  }

  addItem(): FormGroup {
    return this.formBuilder.group({
      typeControl: ['', Validators.required],
      valueControl: [
        '', this.urlValidator()
      ]
    });
  }

  discontinueAdd = () => this.urlForm.get('items').value.length === this.data.types.length;

  isUrlInvalid = () => true;

  getOptions = (index) => {
    const items = this.urlForm.get('items').value;
    const seenKeys = items.slice(0, index).map( e => e.typeControl );
    const filteredArray = this.data.types.filter( (e) => !seenKeys.includes(e.urlTypeId));
    return filteredArray;
  }

  urlValidator = () => {
    return Validators.compose([
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(100),
      Validators.pattern( '^(http:\/\/|https:\/\/)((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$' )
    ])
  };


  loadItems(): FormGroup[] {
    const newArray = this.data.urls.map(aUrl => {
      const newUrl = this.formBuilder.group({
        typeControl: [aUrl.urlType.urlTypeId,  Validators.required],
        valueControl: [aUrl.urlValue, this.urlValidator()]
      });
      return newUrl;
    });
    return newArray;
  }

  removeUrl(index): void {
    const items = this.urlForm.get('items') as FormArray;
    items.removeAt(index);
  }

  addUrl(): void {
    const items = this.urlForm.get('items') as FormArray;
    items.push(this.addItem());
  }

  getTypeById = (id: string) => this.data.types.filter( e => e.urlTypeId === id)[0];

  processDone(): void {
    if ( this.urlForm.valid ) {
      const updatedItems = this.urlForm.get('items').value;
      const newData = updatedItems.map( anItem => new Url(
        this.getTypeById(anItem.typeControl),
        anItem.valueControl,
        'unused'
      ));
      this.dialogRef.close(newData);
    }
  }

  closeWithoutSaving(): void {
    this.dialogRef.close();
  }
}
