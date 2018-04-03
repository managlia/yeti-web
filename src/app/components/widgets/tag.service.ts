import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { TagDetailsComponent } from './tag-details/tag-details.component';
import { Tag } from '../../classes/common/tag';

@Injectable()
export class TagService {

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(tags: any[]): Observable<any[]> {
    const dialogRef = this.dialog.open(TagDetailsComponent, {
      width: '600px',
      height: '300px',
      data: tags
    });

    return dialogRef.afterClosed();
  }
}
