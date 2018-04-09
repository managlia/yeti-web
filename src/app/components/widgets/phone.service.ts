import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { Phone } from '../../classes/common/phone';
import { PhoneType } from '../../classes/types/phone-type';
import { PhoneDetailsComponent } from './phone-details/phone-details.component';

@Injectable()
export class PhoneService {

  phones: Phone[] = [
    new Phone(new PhoneType(), '', '')
  ];

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(phones: Phone[], types: PhoneType[]): Observable<Phone[]> {
    const data = {
      phones:  (phones ? phones : this.phones),
      types: types
    };
    const dialogRef = this.dialog.open(PhoneDetailsComponent, {
      width: '900px',
      height: '600px',
      data: data
    });
    return dialogRef.afterClosed();
  }

}
