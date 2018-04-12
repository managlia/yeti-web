import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

import { Url } from '../../classes/common/url';
import { UrlType } from '../../classes/types/url-type';
import { UrlDetailsComponent } from './url-details/url-details.component';

@Injectable()
export class UrlService {

  urls: Url[] = [
    new Url(new UrlType(), '', '')
  ];

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(urls: Url[], types: UrlType[]): Observable<Url[]> {
    const data = {
      urls:  urls && urls.length > 0 ? urls : this.urls,
      types: types
    };
    const dialogRef = this.dialog.open(UrlDetailsComponent, {
      width: '900px',
      height: '600px',
      data: data
    });
    return dialogRef.afterClosed();
  }

}
