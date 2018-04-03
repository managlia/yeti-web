import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { AttachmentDetailsComponent } from './attachment-details/attachment-details.component';
import { Attachment } from '../../classes/common/attachment';

@Injectable()
export class AttachmentService {

  attachments: Attachment[] = [new Attachment(
    '',
    '',
    '',
    '')];

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(attachments: Attachment[]): Observable<Attachment[]> {
    const dialogRef = this.dialog.open(AttachmentDetailsComponent, {
      width: '1400px',
      height: '600px',
      data: (attachments ? attachments : this.attachments)
    });

    return dialogRef.afterClosed();
  }
}
