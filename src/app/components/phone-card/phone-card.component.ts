import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';

import { PhoneType } from '../../classes/types/phone-type';
import { Phone } from '../../classes/common/phone';
import {CardComponent} from '../base/card/card.component';

@Component({
  selector: 'app-phone-card',
  templateUrl: './phone-card.component.html',
  styleUrls: ['./phone-card.component.css']
})

export class PhoneCardComponent extends CardComponent implements OnInit, OnChanges {

  @Output() phonesUpdated = new EventEmitter<Phone[]>();

  @Input() phones: Phone[];
  @Input() phoneTypes: PhoneType[];

  ngOnInit() {
    this.cardName = 'phone';
    this.storePristineElements();
  }

  storePristineElements = () => this.pristineElements = _.cloneDeep(this.phones);

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if ( changes.phones && this.pristineElements ) {
      if ( _.differenceWith(changes.phones.currentValue, this.pristineElements, _.isEqual).length === 0 ) {
        // exclusively for reset button on the parent
        this.cardIsDirty = false;
      }
    }
  }

  openPhone = (phone: string) => {
    window.open( phone, '_blank', phone);
  };

  openPhoneDialog(): void {
    this.phoneService.openDialog(this.phones, this.phoneTypes)
      .subscribe( result => {
        if (result) {
          this.cardIsDirty = true;
          this.phones = result;
          this.phonesUpdated.emit(result);
        }
      });
  }
}
