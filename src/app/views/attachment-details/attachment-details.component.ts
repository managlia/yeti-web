import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { BaseViewComponent } from '../../components/base/base-view/base-view.component';
import { File } from '../../classes/common/file';

@Component({
  selector: 'app-attachment-details',
  templateUrl: './attachment-details.component.html',
  styleUrls: ['./attachment-details.component.scss']
})
export class AttachmentDetailsComponent extends BaseViewComponent implements OnInit {

  files: File[];

  ngOnInit() {
    this.getFileList();
  }

  getFileList = () => this.attachmentService.getFileList().subscribe( results => this.files = results );
}



