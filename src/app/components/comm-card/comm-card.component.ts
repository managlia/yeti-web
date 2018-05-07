import {Component, EventEmitter, OnInit, OnChanges, Input, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

import {BaseViewComponent} from '../../components/base/base-view/base-view.component';
import {Contact} from '../../classes/contact';
import {Announcement} from '../../classes/comms/announcement';
import {DataStore} from '../../classes/data-store';

@Component({
  selector: 'app-comm-card',
  templateUrl: './comm-card.component.html',
  styleUrls: ['./comm-card.component.scss']
})
export class CommCardComponent extends BaseViewComponent implements OnInit, OnChanges {

  @ViewChild('commSubject') commSubject;
  @ViewChild('commBody') commBody;
  @Output() dataChanged = new EventEmitter<boolean>();
  @Output() commCanceled = new EventEmitter<boolean>();
  @Input() replyToComm;
  @Input() showCommCard = true;
  communication: any;
  commId: number;
  currentRecipients: Contact[] = [];
  refreshData = false;

  ngOnChanges( changes: SimpleChanges) {
    if ( changes.replyToComm && changes.replyToComm.currentValue ) {
      if ( this.replyToComm ) {
        if ( !this.entityFormGroup ) {
          this.communication = new Announcement();
          this.communication.communicationType = this.replyToComm.type;
          this.createForm();
        }
        this.communicationSubject.patchValue( '[RE] ' + this.replyToComm.description );
        this.communicationBody.patchValue( '\r\n\r\n------------\r\n[ORIG] ' + this.replyToComm.value );
        this.communicationType.patchValue( this.replyToComm.type );

        if ( this.replyToComm.recipientDetails ) {
          this.currentRecipients = this.replyToComm.recipientDetails;
          this.currentRecipients.push( this.replyToComm.creatorDetails );
          this.currentRecipients = this.currentRecipients.filter( e => e.contactId !== DataStore.userId );
        }
        window.scrollTo(0, 0);
        this.setCursor();
      }
    }
  }

  ngOnInit() {
    this.entityName = 'communication';
    this.initForm();
    this.setCursor();
  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.initForm();
    this.replyToComm = null;
    this.commCanceled.emit(true);
  };

  initForm = () => {
    const commType = this.route.snapshot.paramMap.get('type');
    const commId = this.route.snapshot.paramMap.get('id');
    if (commId) {
      this.getCommunication(commType, commId);
    } else if ( !this.communication ) {
      this.communication = new Announcement();
      this.communication.communicationType = 'announcement';
      this.createForm();
    }
  };

  setCursor = () => {
    const curseSubject = !this.communicationSubject.value || this.communicationSubject.value.length === 0;
    const curseBody = !curseSubject;
    if ( curseSubject ) {
      if (this.commSubject.nativeElement.setSelectionRange) {
        this.commSubject.nativeElement.focus();
        this.commSubject.nativeElement.setSelectionRange(0, 0);
      } else if (this.commSubject.nativeElement.createTextRange) {
        const range = this.commSubject.nativeElement.createTextRange();
        range.moveStart('character', 0);
        range.select();
      }
    } else if ( curseBody  ) {
      if (this.commBody.nativeElement.setSelectionRange) {
        this.commBody.nativeElement.focus();
        this.commBody.nativeElement.setSelectionRange(0, 0);
      } else if (this.commBody.nativeElement.createTextRange) {
        const range = this.commBody.nativeElement.createTextRange();
        range.moveStart('character', 0);
        range.select();
      }
    }
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

  getCommunication(commType: string, commId: string): void {
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
    this.refreshData = true;
    this.dataChanged.emit(this.refreshData);
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







