import {Component, OnInit, OnChanges, Input, Output, Renderer, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { Contact } from '../../classes/contact';
import { Company } from '../../classes/company';
import { Action } from '../../classes/action';
import { Campaign } from '../../classes/campaign';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})

export class ContactCardComponent implements OnInit {
  fontColor = 'black';

  @Input() companyId: string;
  @Input() actionId: string;
  @Input() campaignId: string;
  @Input() associationSuccessful = false;
  @Output() onContactFlaggedForRemoval = new EventEmitter<Contact>();
  @Output() onContactAssociatedToEntity = new EventEmitter<Contact>();

  contacts: Contact[];

  constructor(
    private contactService: ContactService,
    public renderer: Renderer,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(`companyCardComponent this.companyId is ${this.companyId}`);
    console.log(`companyCardComponent this.actionId is ${this.actionId}`);
    console.log(`companyCardComponent this.campaignId is ${this.campaignId}`);
    if (this.companyId) {
      this.getContactsByCustomerId();
    } else if (this.actionId) {
      this.getContactsByActionId();
    } else if (this.campaignId) {
      this.getContactsByCampaignId();
    } else {
      this.contacts = [];
    }
  }

  onContactAdded(contact: Contact) {
    console.log('onContactAdded / onContactAssociatedToEntity');
    this.onContactAssociatedToEntity.emit(contact);
  }

  removeContact(contact: Contact) {
    this.onContactFlaggedForRemoval.emit(contact);
   _.remove(this.contacts, {
     contactId: contact.contactId
   });
  }

  getContactsByCustomerId(): void {
    this.contactService.getContactListByCompany( this.companyId )
      .subscribe(contacts => this.contacts = contacts );
  }

  getContactsByActionId(): void {
    console.log(`dfmdfm getting contacts by action id ${this.actionId}`);
    this.contactService.getContactListByAction( this.actionId )
      .subscribe(contacts => this.contacts = contacts );
  }

  getContactsByCampaignId(): void {
    this.contactService.getContactListByCampaign( this.campaignId )
      .subscribe(contacts => this.contacts = contacts );
  }

  createNewContact(): void {
    console.log('ready to add a new contact');
    if (this.companyId) {
      this.router.navigateByUrl( `/contact/add/company/${this.companyId}` );
    } else if (this.actionId) {
      this.router.navigateByUrl( `/contact/add/action/${this.actionId}` );
    } else if (this.campaignId) {
      this.router.navigateByUrl( `/contact/add/campaign/${this.campaignId}` );
    }
  }

  onConsideringContact($event, thediv): void {
    const target =  event.currentTarget || event.target || event.srcElement ;
    this.renderer.setElementStyle(target, 'color', 'rebeccapurple');
    this.renderer.setElementStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringContact($event, thediv): void {
    const target =  event.currentTarget || event.target || event.srcElement ;
    this.renderer.setElementStyle(target, 'color', this.fontColor);
  }

  onSelectedContact($event, contactId): void {
    console.log(`clicked on ${contactId}`);
    this.router.navigateByUrl( `/contact/${contactId}` );
  }

}

