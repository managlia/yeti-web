import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import * as _ from 'lodash';

import { Contact } from '../../classes/contact';
import { CardComponent } from '../base/card/card.component';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})

export class ContactCardComponent extends CardComponent implements OnInit {

  @Output() onContactFlaggedForRemoval = new EventEmitter<Contact>();
  @Output() onContactAssociatedToEntity = new EventEmitter<Contact>();

  ngOnInit() {
    if (this.companyId) {
      this.getContactsByCustomerId();
    } else if (this.actionId) {
      this.getContactsByActionId();
    } else if (this.campaignId) {
      this.getContactsByCampaignId();
    } else {
      this.entities = [];
    }
  }

  getContactsByCustomerId(): void {
    this.contactService.getContactListByCompany( this.companyId )
      .subscribe(contacts => this.entities = contacts );
  }

  getContactsByActionId(): void {
    console.log(`dfmdfm getting contacts by action id ${this.actionId}`);
    this.contactService.getContactListByAction( this.actionId )
      .subscribe(contacts => this.entities = contacts );
  }

  getContactsByCampaignId(): void {
    this.contactService.getContactListByCampaign( this.campaignId )
      .subscribe(contacts => this.entities = contacts );
  }

  onContactAdded(contact: Contact) {
    this.onContactAssociatedToEntity.emit(contact);
  }

  removeContact(contact: Contact) {
    this.onContactFlaggedForRemoval.emit(contact);
   _.remove(this.entities, {
     contactId: contact.contactId
   });
  }


  createNewContact(): void {
    if (this.companyId) {
      this.router.navigateByUrl( `/contact/add/company/${this.companyId}` );
    } else if (this.actionId) {
      this.router.navigateByUrl( `/contact/add/action/${this.actionId}` );
    } else if (this.campaignId) {
      this.router.navigateByUrl( `/contact/add/campaign/${this.campaignId}` );
    }
  }

  onSelectedContact($event, contactId): void {
    this.router.navigateByUrl( `/contact/${contactId}` );
  }
}

