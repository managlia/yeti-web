import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

 import { Url } from '../../../classes/common/url';
 import { UrlType } from '../../../classes/types/url-type';

@Component({
  selector: 'app-url-details',
  templateUrl: './url-details.component.html',
  styleUrls: ['./url-details.component.css']
})
export class UrlDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UrlDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  removeUrl(event, value): void {
    if ( event.returnValue ) {
      console.log('event is ', event);
      console.log('want to remove ' + value.urId);
      this.data.urls.splice(this.data.urls.indexOf(value), 1);
    }
  }

  addUrl(): void {
    this.data.urls.push(new Url('', new UrlType('', '', ''), '', ''));
  }

}
