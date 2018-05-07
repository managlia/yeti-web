import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { ActionQuickEditComponent } from './action-quick-edit/action-quick-edit.component';
import { Action } from '../../classes/action';

@Injectable()
export class ActionQuickEditService {

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(data: any): Observable<Action> {
    console.log('data', data);
    const dialogRef = this.dialog.open(ActionQuickEditComponent, {
      width: '800px',
      height: '735px',
      data: data
    });
    return dialogRef.afterClosed();
  }
}
