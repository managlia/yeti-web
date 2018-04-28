import {Component, OnInit, AfterViewInit, Input, ElementRef, ViewChild, SimpleChanges} from '@angular/core';
import * as Dropzone from 'dropzone';
import * as FileSaver from 'file-saver';

import { Attachment } from '../../classes/common/attachment';
import {CardComponent} from '../base/card/card.component';

@Component({
  selector: 'app-attachment-card',
  templateUrl: './attachment-card.component.html',
  styleUrls: ['./attachment-card.component.css']
})
export class AttachmentCardComponent extends CardComponent implements OnInit, AfterViewInit {

  @Input() entityType: string;
  @Input() entityId: string;

  attachments: Attachment[];

  fontColor = 'black';

  @ViewChild('theDropZone', {read: ElementRef}) theDropZone;
  @ViewChild('showZone', {read: ElementRef}) showZone;

  ngAfterViewInit() {
    const myDropzone = new Dropzone(this.theDropZone.nativeElement, {
      url: 'http://localhost:5001/yetix/files',
      createImageThumbnails: false,
      addRemoveLinks: false,
      previewTemplate: this.showZone.nativeElement.innerHTML
    });
    const payload = {
      entityType: this.entityType,
      entityId: this.entityId,
      uploaderId: this.resourceId
    };
    myDropzone.on( 'sending', (file, xhr, data) => {
      console.log('sending');
      data.append( 'payload', JSON.stringify(payload) );
    });
    myDropzone.on( 'success', (whatever) => {
      console.log('success');
      this.getAttachmentsList();
    });
  }

  ngOnInit() {
    this.getAttachmentsList();
  }

  selectAttachment = (file: Attachment) => {
    this.attachmentService.getFile(file.fileId, file.fileType)
      .then(blob => {
          const binaryData = [];
          binaryData.push(blob.body);
          FileSaver.saveAs(new Blob(binaryData), file.fileName);
        },
          error => console.log('error', error)
       );
   };

  getAttachmentsList = () => {
    if ( this.entityType && this.entityId ) {
      this.attachmentService.getFileListForEntity(this.entityType, this.entityId)
        .subscribe(e => this.attachments = e);
    } else {
      console.error('entityType and/or entityId not defined');
    }
  };

}
