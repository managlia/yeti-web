import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import {ActionDetailsComponent} from '../action-details/action-details.component';
import {ActionClassificationType} from '../../classes/types/action-classification-type';
import {ScopeType} from '../../classes/types/scope-type';
import { Email } from '../../classes/email';
import {CalendarEvent} from '../../classes/calendar-event';
import {Contact} from '../../classes/contact';
import * as moment from 'moment';

@Component({
  selector: 'app-action-details',
  templateUrl: './email-details.component.html',
  styleUrls: ['./email-details.component.css']
})

export class EmailDetailsComponent extends ActionDetailsComponent {
  emailFormGroup: FormGroup;
  recipients: Contact[];
  @Input() action: Email;
  reminderDate: Date;
  hasRecipients = false;

  // deliveryReceipt: boolean;
  // readReceipt: boolean;
  // reminderRequested: boolean;
  // reminderDate: Date;

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getActionById();
    this.emailFormGroup = this.formBuilder.group({
      'name' : ['', Validators.required],
      'description' : ['', Validators.required],
      'scopeTypeId' : ['', Validators.required],
      'deliveryReceipt' : [false],
      'readReceipt' : [false],
      'reminderRequested' : [false]
    });
  }

  getActionById(): void {
    this.actionId = this.route.snapshot.paramMap.get('id');
    if ( this.actionId ) {
      console.log('emailId ' + this.actionId);
      this.actionService.getEmail(this.actionId)
        .subscribe(email => {
          this.action = email;
          this.action.scopeType ? console.log('skipa') : this.action.scopeType = new ScopeType();
          this.action.classificationType ? console.log('skipb') : this.action.classificationType = new ActionClassificationType();
          console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Action ${this.action} >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`, this.action );

          this.emailFormGroup.patchValue({
            name: this.action.name,
            description: this.action.description,
            scopeTypeId: this.action.scopeType.scopeTypeId
          });

        });
    } else {
      this.action = new Email();
      this.reminderDate = moment().add(7 , 'day' ).toDate();
      this.action.classificationType.actionClassificationTypeId = 'EM';
      console.log('reminder date is ' + this.reminderDate);
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      if ( this.entity ) {
        if ( this.entity === 'company' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'contact' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        } else if ( this.entity === 'campaign' ) {
          console.log(`------------------------------->>>>>:: entity & entityId ${this.entity} and ${this.entityId}`);
        }
      }
    }
  }

  onContactAddedAsRecipient(contacts: Contact[]): void {
    this.recipients = contacts;
    this.hasRecipients = this.haveARecipient();
    console.log('taking no action right now', this.recipients.length);
  }

  onContactRemovedAsRecipient(contacts: Contact[]): void {
    this.recipients = contacts;
    this.hasRecipients = this.haveARecipient();
    console.log('taking no action right now', this.recipients.length);
  }

  haveARecipient(): boolean {
    const onlyReipients = this.recipients.filter( contact => contact.emailRecipientIndicator === 'to' );
    return( onlyReipients && onlyReipients.length > 0 );
  }



  onDateUpdated(theDate: Date): void {
    this.reminderDate = theDate;
    console.log(' (((((((((((((((((((((((((( onDateUpdated ))))))))))))))))))))))))))))))))))))))  ', this.reminderDate);
    if (!this.emailFormGroup.value.reminderRequested) {
      this.emailFormGroup.patchValue({
        reminderRequested: true
      });
    }
  }

  addUpdateAction() {
    this.updateActionFromForm();

    this.emailService.sendEmail(this.action).subscribe(
      response => console.log('sent an email', response) );

    console.log('1. Validate data: ' + JSON.stringify(this.action));
    console.log('2. Send email.');
    console.log('3. Add email action to database.');
    console.log('4. Add recipients to contacts for this action in the database.');
    console.log('5. Schedule reminder with some link to the email.');
    console.log('6. Add reminder action to database as a child of the email action.');
    console.log('7. Display page with contacts, companies and campaigns so those lists can be modified.');
  }

  updateActionFromForm(): void {
    this.action.recipients = this.recipients;
    this.action.name = this.emailFormGroup.value.name;
    this.action.description = this.emailFormGroup.value.description;
    this.action.scopeType.scopeTypeId = this.emailFormGroup.value.scopeTypeId;
    this.action.deliveryReceipt = this.emailFormGroup.value.deliveryReceipt;
    this.action.readReceipt = this.emailFormGroup.value.readReceipt;
    this.action.reminderRequested = this.emailFormGroup.value.reminderRequested;
    if ( this.action.reminderRequested ) {
      this.action.reminderDate = this.reminderDate;
      const calendarEvent = new CalendarEvent();

      calendarEvent.name = `Reminder: Follow up to email "${this.action.name}"`;
      calendarEvent.description = `Follow up to email "${this.action.name}"`;

      calendarEvent.targetCompletionDate = this.reminderDate;
      this.action.calendarEvents = [ calendarEvent ];
    }
  }
}
