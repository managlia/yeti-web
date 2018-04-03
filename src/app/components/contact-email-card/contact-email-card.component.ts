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

  onContactAdded(contact: Contact) {
    console.log('---->>>>>> OVERRIDING onContactAdded / onContactAssociatedToEntity');
    contact.emailRecipientIndicator = 'to';
    this.onContactAddedAsRecipient.emit(this.contacts);
  }

  removeContact(removedContact: Contact) {
    console.log('---->>>>>> OVERRIDING removeContact / onContactFlaggedForRemoval');
    this.contacts = this.contacts.filter( contact => contact !== removedContact );
    this.onContactRemovedAsRecipient.emit(this.contacts);
  }


}



