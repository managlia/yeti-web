import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { CampaignQuickEditComponent } from './campaign-quick-edit/campaign-quick-edit.component';
import { Campaign } from '../../classes/campaign';

@Injectable()
export class CampaignQuickEditService {

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(data: any): Observable<Campaign> {
    console.log('data', data);
    const dialogRef = this.dialog.open(CampaignQuickEditComponent, {
      width: '800px',
      height: '630px',
      data: data
    });
    return dialogRef.afterClosed();
  }
}
