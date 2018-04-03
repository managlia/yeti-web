import {Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { MatDatepicker } from '@angular/material';
import * as moment from 'moment';
import {Contact} from '../../../classes/contact';

@Component({
  selector: 'app-simple-date-picker',
  templateUrl: './simple-date-picker.component.html',
  styleUrls: ['./simple-date-picker.component.css']
})
export class SimpleDatePickerComponent implements OnInit {
  @Output() onDateUpdated = new EventEmitter<Date>();
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  @Input() theDate: Date = new Date();
  @Input() keyPhrase: 'Choose a';
  today = new Date;
  daysFromToday = 0;

  constructor() { }

  ngOnInit() {
    this.theDate = (!this.theDate) ? new Date() : this.theDate;
    this.daysFromToday = this.getSpread();
  }

  dateChanged(event): void {
    console.log('date changed to ', event);
    this.recalculateUsing('date');
  }

  daysChanged(event): void {
    console.log('days changed to ', event);
    this.recalculateUsing('number');
  }

  recalculateUsing( instruction: string ): void {
    console.log( 'instruction ' + instruction );
    console.log( 'theDate ' + this.theDate );
    console.log( 'daysFromToday ' + this.daysFromToday );
    if ( instruction === 'number' ) {
      this.theDate = moment().add(this.daysFromToday, 'day' ).toDate();
    } else {
      this.daysFromToday = this.getSpread();
    }
    this.onDateUpdated.emit(this.theDate);
  }

  getSpread(): number {
    const theDateMoment = moment(this.theDate);
    const todayMoment = moment();
    return theDateMoment.diff(todayMoment, 'days') + 1;// =1
  }

}
