import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { PhoneType } from '../../classes/types/phone-type';
import { Phone } from '../../classes/common/phone';
import {CardComponent} from '../base/card/card.component';

@Component({
  selector: 'app-phone-card',
  templateUrl: './phone-card.component.html',
  styleUrls: ['./phone-card.component.css']
})

export class PhoneCardComponent extends CardComponent implements OnInit {

  @Output() phonesUpdated = new EventEmitter<Phone[]>();

  @Input() phones: Phone[];
  @Input() phoneTypes: PhoneType[];

  ngOnInit() {
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
