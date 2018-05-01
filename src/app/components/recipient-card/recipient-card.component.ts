import {Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, Inject} from '@angular/core';

import { Contact } from '../../classes/contact';
import {Observable} from 'rxjs/Observable';
import {MAT_DIALOG_DATA, MatAutocompleteTrigger, MatDialogRef, MatAutocompleteSelectedEvent} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {DataStore} from '../../classes/data-store';
import {CardComponent} from '../base/card/card.component';
import {startWith} from 'rxjs/operators/startWith';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators/map';

@Component({
  selector: 'app-recipient-card',
  templateUrl: './recipient-card.component.html',
  styleUrls: ['./recipient-card.component.scss']
})
export class RecipientCardComponent extends CardComponent implements OnInit, OnChanges {

  @Output() contactListModified = new EventEmitter<Contact[]>();
  @Input() currentRecipients: Contact[] = [];

  @ViewChild('chipSearch') input: ElementRef;
  @ViewChild('chipSearch', {read: MatAutocompleteTrigger}) autoComplete: MatAutocompleteTrigger;

  recipientPicker: FormGroup = new FormGroup( {});
  filteredOptions: Observable<Contact[]>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  wholeRecipientList: Contact[];
  private searchTerms = new Subject<string>();
  flagAsInvalid = false;

  separatorKeysCodes = [ENTER, COMMA];

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes occurred');
  }

  ngOnInit() {
    console.log('init occurred');
    this.populateWholeList();
    this.recipientPicker.addControl( 'recipientSearch', new FormControl('' ) );
    this.filteredOptions = this.recipientSearch.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }

  get recipientSearch() { return this.recipientPicker.get('recipientSearch'); }

  filter(val: string): Contact[] {
    if ( (val) && (val.length > 0) ) {
      return this.wholeRecipientList.filter(option => {
        const name = option.firstName + ' ' + option.lastName;
        return name.toLowerCase().indexOf(val.toLowerCase()) > -1
      }).filter( option => this.currentRecipients.indexOf(option) === -1 );
    } else {
      return [];
    }
  }

  populateWholeList = () => this.contactService.getContactListByCompany( DataStore.companyId )
    .subscribe(contacts => this.wholeRecipientList = contacts);

  add = (event: MatAutocompleteSelectedEvent) => {
    const recipient = event.option.value;
    console.log('want to recipient', recipient);
    console.log('want to event', event);
    this.currentRecipients.push(recipient);

    event.option.deselect();
    event.option.value = null;

    this.recipientSearch.patchValue('');
    this.recipientSearch.setValue('');
    this.contactListModified.emit(this.currentRecipients);
  };

  remove = (recipient: Contact) => {
    this.currentRecipients = this.currentRecipients.filter(e => e !== recipient);
  };

  displayNull = () => {
    return null;
  }
}


