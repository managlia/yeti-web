import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { TagDetailsComponent } from './tag-details/tag-details.component';
import { Tag } from '../../classes/common/tag';

@Injectable()
export class TaggingService {

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(data: any): Observable<string[]> {
    const dialogRef = this.dialog.open(TagDetailsComponent, {
      width: '650px',
      height: '400px',
      data: data
    });

    return dialogRef.afterClosed();
  }
}
