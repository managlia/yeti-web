import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { ChatterDetailsComponent } from './chatter-details/chatter-details.component';

@Injectable()
export class ChatterService {

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(data: any): Observable<any> {
    console.log('data', data);
    const dialogRef = this.dialog.open(ChatterDetailsComponent, {
      width: '1200px',
      height: '800px',
      data: data
    });
    return dialogRef.afterClosed();
  }
}
