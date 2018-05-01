import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as _ from 'lodash';

import {BaseViewComponent} from '../../components/base/base-view/base-view.component';
import {Team} from '../../classes/team';
import {Contact} from '../../classes/contact';
import {Announcement} from '../../classes/comms/announcement';

@Component({
  selector: 'app-communication-details',
  templateUrl: './communication-details.component.html',
  styleUrls: ['./communication-details.component.scss']
})
export class CommunicationDetailsComponent extends BaseViewComponent implements OnInit {

  communication: any;
  commId: number;
  currentRecipients: Contact[] = [];

  ngOnInit() {
    this.entityName = 'communication';
    window.scrollTo(0, 0);
    this.getCommunication();
  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.getCommunication();
  };

  createForm() {
    this.entityFormGroup = this.formBuilder.group({ // <-- the parent FormGroup
      communicationType: new FormControl(this.communication.communicationType, [Validators.required]),
      communicationSubject:  new FormControl(this.communication.description, [Validators.required]),
      communicationBody:  new FormControl(this.communication.value)
    });
    this.onChanges();
    this.entityLoaded = true;
  }

  get communicationType() { return this.entityFormGroup.get('communicationType'); }
  get communicationSubject() { return this.entityFormGroup.get('communicationSubject'); }
  get communicationBody() { return this.entityFormGroup.get('communicationBody'); }

  onChanges = () => {
    this.entityFormGroup.valueChanges.subscribe( val => {
      console.log('==================> ' + JSON.stringify(val));
    });
    this.communicationType.valueChanges.subscribe( val => {
      console.log('start communicationType ' + this.communicationType.value);
    });
    this.communicationSubject.valueChanges.subscribe( val => {
      console.log('start communicationSubject ' + this.communicationSubject.value);
    });
    this.communicationBody.valueChanges.subscribe( val => {
      console.log('start communicationBody ' + this.communicationBody.value);
    });
  };

  copyFormToComm = () => {
    this.communication.communicationType = this.communicationType.value;
    this.communication.description = this.communicationSubject.value;
    this.communication.value = this.communicationBody.value;
  };

  getCommunication(): void {
    const commType = this.route.snapshot.paramMap.get('type');
    const commId = this.route.snapshot.paramMap.get('id');
    if (commId) {
      if ( commType === 'announcement' ) {
        this.announcementService.getAnnouncement(commId).subscribe(
          communication => {
            this.communication = communication;
            this.commId = this.communication.announcementId;
            this.createForm();
          });
      } else if ( commType === 'memo' ) {
        this.memoService.getMemo(commId).subscribe(
          communication => {
            this.communication = communication;
            this.commId = this.communication.memoId;
            this.createForm();
          });
      }
    } else {
      this.communication = new Announcement();
      this.communication.communicationType = 'announcement';
      this.createForm();
    }
  }

  addUpdateCommunication() {
    this.copyFormToComm();
    if (this.commId) {
      if (this.communicationType.value === 'announcement') {
        this.announcementService.updateAnnouncement(this.communication).subscribe(
          result => {
            this.handleSuccess();
          });
      } else if (this.communicationType.value === 'memo') {
        this.memoService.updateMemo(this.communication).subscribe(
          cresult => {
            this.handleSuccess();
          });
      }
    } else {
      this.communication.creatorId = this.resourceId;
      if (this.communicationType.value === 'announcement') {
        this.announcementService.addAnnouncement(this.communication).toPromise().then(
          response => {
            this.handleSuccess();
          });
      } else {
        this.communication.recipients = this.currentRecipients.map(e => e.contactId );
        this.memoService.addMemo(this.communication).subscribe(
          response => {
            this.handleSuccess();
          });
      }
    }
  }

  handleSuccess() {
    this.showAssocationSuccessful('communication');
    this.resetForm();
  }

  isMemo = () => {
    const isMemo = this.communicationType.value === 'memo';
    if ( isMemo ) {
      return true;
    } else {
      this.currentRecipients = [];
      return false;
    }
  };

  updateContactList = (recipients: Contact[]) => {
    this.currentRecipients = recipients;
  };
}







