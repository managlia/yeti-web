import { Component, OnInit, Input } from '@angular/core';

import { BaseViewComponent } from '../../components/base/base-view/base-view.component';
import { Attachment } from '../../classes/common/attachment';

@Component({
  selector: 'app-attachment-details',
  templateUrl: './attachment-details.component.html',
  styleUrls: ['./attachment-details.component.scss']
})
export class AttachmentDetailsComponent extends BaseViewComponent implements OnInit {

  files: Attachment[];

  ngOnInit() {
    this.getFileList();
  }

  getFileList = () => this.attachmentService.getFileList().subscribe( results => this.files = results );
}



