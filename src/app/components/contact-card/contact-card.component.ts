import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import * as _ from 'lodash';

import { Contact } from '../../classes/contact';
import { CardComponent } from '../base/card/card.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})

export class ContactCardComponent extends CardComponent implements OnInit {

  @Output() onContactFlaggedForRemoval = new EventEmitter<string>();
  @Output() onContactAssociatedToEntity = new EventEmitter<Contact>();

  ngOnInit() {
    if (this.companyId) {
      this.getContactsByCustomerId();
    } else if (this.actionId) {
      this.getContactsByActionId();
    } else if (this.teamId) {
      this.getContactsByTeamId();
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

  getContactsByTeamId(): void {
    this.contactService.getContactListByTeam( this.teamId )
      .subscribe(contacts => this.entities = contacts );
  }

  getContactsByCampaignId(): void {
    this.contactService.getContactListByCampaign( this.campaignId )
      .subscribe(contacts => this.entities = contacts );
  }

  onContactAdded(contact: Contact) {
    this.onContactAssociatedToEntity.emit(contact);
    this.suspendedUndoEvent  = new Observable<any>(observer => {
      this.entities = this.entities.filter(e => e.contactId !== contact.contactId);
      observer.next('undone');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  removeContact(contactId: string) {
    console.log('removing contactId ', contactId);
    this.onContactFlaggedForRemoval.emit(contactId);
    this.suspendedEvent = new Observable<any> ( observer => {
      this.entities = this.entities.filter( e => e.contactId !== contactId );
      observer.next('success');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  createNewContact(): void {
    if (this.companyId) {
      this.router.navigateByUrl( `/contact/add/company/${this.companyId}` );
    } else if (this.actionId) {
      this.router.navigateByUrl( `/contact/add/action/${this.actionId}` );
    } else if (this.teamId) {
      this.router.navigateByUrl( `/contact/add/team/${this.teamId}` );
    } else if (this.campaignId) {
      this.router.navigateByUrl( `/contact/add/campaign/${this.campaignId}` );
    }
  }

  onSelectedContact($event, contactId): void {
    this.router.navigateByUrl( `/contact/${contactId}` );
  }
}

