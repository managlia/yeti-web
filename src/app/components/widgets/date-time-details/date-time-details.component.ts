import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDatepicker, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-date-time-details',
  templateUrl: './date-time-details.component.html',
  styleUrls: ['./date-time-details.component.css']
})

export class DateTimeDetailsComponent implements OnInit {
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  durations = [
    { minutes: 15, description: '15 minutes' },
    { minutes: 30, description: '30 minutes' },
    { minutes: 45, description: '45 minutes' },
    { minutes: 60, description: '1 hour' },
    { minutes: 75, description: '1 hour 15 minutes' },
    { minutes: 90, description: '1 hour 30 minutes' },
    { minutes: 105, description: '1 hour 45 minutes' },
    { minutes: 120, description: '2 hours' },
    { minutes: 135, description: '2 hours 15 minutes' },
    { minutes: 150, description: '2 hours 30 minutes' },
    { minutes: 165, description: '2 hours 45 minutes' },
    { minutes: 180, description: '3 hours' },
    { minutes: 181, description: 'The rest of the day' },
  ];

  hours = [
    { hourInt: 5, description: '5 am' },
    { hourInt: 6, description: '6 am' },
    { hourInt: 7, description: '7 am' },
    { hourInt: 8, description: '8 am' },
    { hourInt: 9, description: '9 am' },
    { hourInt: 10, description: '10 am' },
    { hourInt: 11, description: '11 am' },
    { hourInt: 12, description: '12 pm' },
    { hourInt: 13, description: '1 pm' },
    { hourInt: 14, description: '2 pm' },
    { hourInt: 15, description: '3 pm' },
    { hourInt: 16, description: '4 pm' },
    { hourInt: 17, description: '5 pm' },
    { hourInt: 18, description: '6 pm' },
    { hourInt: 19, description: '7 pm' },
    { hourInt: 20, description: '8 pm' },
    { hourInt: 21, description: '9 pm' },
    { hourInt: 22, description: '10 pm' },
  ];

  minutes = [
    { minuteInt: 0, description: '00 (top of hour)' },
    { minuteInt: 15, description: '15 minutes after hour' },
    { minuteInt: 30, description: '30 minutes after hour' },
    { minuteInt: 45, description: '45 minutes after hour' },
  ];

  constructor(
    public dialogRef: MatDialogRef<DateTimeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  dateChanged(event, values): void {
    console.log('date changed to ' + values[0]);
    this.updateDates(values);
  }

  hourChanged(event, values): void {
    console.log('hour changed to ' + values[1]);
    this.updateEndTimes(values);
    this.updateDates(values);
  }

  minuteChanged(event, values): void {
    console.log('minute changed to ' + values[2]);
    this.updateEndTimes(values);
    this.updateDates(values);
  }

  durationChanged(event, values): void {
    console.log('duration changed to ' + values[3]);
    this.updateEndTimes(values);
    this.updateDates(values);
  }

  endHourChanged(event, values): void {
    console.log('end hour changed to ' + values[4]);
    this.updateDates(values);
  }

  endMinuteChanged(event, values): void {
    console.log('end minute changed to ' + values[5]);
    this.updateDates(values);
  }

  updateEndTimes(values): void {
    const minuteIncrement = values[3] / 15;
    const currentStartIncrement = values[2] / 15;
    if ( (minuteIncrement + currentStartIncrement) > 3 ) {
      values[4] = values[1] + _.floor((minuteIncrement + currentStartIncrement) / 4, 0);
      console.log( 'updated hour ' + values[4] );
      values[5] = ((minuteIncrement + currentStartIncrement) % 4) * 15;
      console.log( 'updated minute ' + values[5] );
    } else {
      values[4] = values[1];
      values[5] = (minuteIncrement + currentStartIncrement) * 15;
    }
  }

  updateDates(values): void {
      values[6] = moment( [values[0].getFullYear(), values[0].getMonth(), values[0].getDate(), values[1], values[2]] );
      values[7] = moment( [values[0].getFullYear(), values[0].getMonth(), values[0].getDate(), values[4], values[5]] );
  }

}
