import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import * as moment from 'moment';

import { DateTimeDetailsComponent } from './date-time-details/date-time-details.component';

@Injectable()
export class DateTimeService {


  parsedDate(): any[] {
    const aDate = new Date();
    const baseMinutes = aDate.getMinutes() / 15;
    console.log( 'start minutes == > ' + _.floor(baseMinutes, 0));
    const startMinutes = _.floor(baseMinutes, 0) * 15;
    return [
      aDate,
      aDate.getHours(),
      startMinutes,
      60,
      aDate.getHours() + 1,
      startMinutes,
      moment( [aDate.getFullYear(), aDate.getMonth(), aDate.getDate(), aDate.getHours(), startMinutes] ),
      moment( [aDate.getFullYear(), aDate.getMonth(), aDate.getDate(), aDate.getHours() + 1, startMinutes] )
    ];
  }

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(aDateSelection: any[]): Observable<any[]> {
    const dialogRef = this.dialog.open(DateTimeDetailsComponent, {
      width: '850px',
      height: '550px',
      data: aDateSelection ? aDateSelection : this.parsedDate()
    });

    return dialogRef.afterClosed();
  }

}
