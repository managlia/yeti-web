import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {ContactCardComponent} from '../contact-card/contact-card.component';
import {Contact} from '../../classes/contact';

@Component({
  selector: 'app-contact-email-card',
  templateUrl: './contact-email-card.component.html',
  styleUrls: ['./contact-email-card.component.scss']
})

export class ContactEmailCardComponent extends ContactCardComponent implements OnInit {

  @Output() onContactAddedAsRecipient = new EventEmitter<Contact[]>();
  @Output() onContactRemovedAsRecipient = new EventEmitter<Contact[]>();

  recipientOptions = [
    {key: 'to', value: 'To'},
    {key: 'cc', value: 'CC'},
    {key: 'bcc', value: 'BCC'}
  ];

  onContactAdded(contact: Contact) {
    console.log('---->>>>>> OVERRIDING onContactAdded / onContactAssociatedToEntity');
    contact.emailRecipientIndicator = 'to';
    this.onContactAddedAsRecipient.emit(this.entities);
  }

  removeEmailContact(removedContact: Contact) {
    console.log('---->>>>>> OVERRIDING removeContact / onContactFlaggedForRemoval');
    this.entities = this.entities.filter( contact => contact !== removedContact );
    this.onContactRemovedAsRecipient.emit(this.entities);
  }


}



