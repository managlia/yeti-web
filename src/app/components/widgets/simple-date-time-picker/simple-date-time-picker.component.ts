import {Component, Input, OnInit, AfterViewInit, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import * as countriesAndTimezones from 'countries-and-timezones';
import {DataStore} from '../../../classes/data-store';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-simple-date-time-picker',
  templateUrl: './simple-date-time-picker.component.html',
  styleUrls: ['./simple-date-time-picker.component.scss']
})
export class SimpleDateTimePickerComponent implements OnInit, OnChanges {

  @Input() action: any;
  pickerForm: FormGroup;
  startMoment: any;
  endMoment: any;
  userTimezone = DataStore.userTimezone;

  ampms = [ 'am', 'pm' ];

  timeZones = [];

  durations = [
    { minutes: 0, description: 'None', default: true },
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
    { hourInt: 99, description: 'N/A' },
    { hourInt: 1, description: '1' },
    { hourInt: 2, description: '2' },
    { hourInt: 3, description: '3' },
    { hourInt: 4, description: '4' },
    { hourInt: 5, description: '5' },
    { hourInt: 6, description: '6' },
    { hourInt: 7, description: '7' },
    { hourInt: 8, description: '8' },
    { hourInt: 9, description: '9' },
    { hourInt: 10, description: '10' },
    { hourInt: 11, description: '11' },
    { hourInt: 12, description: '12' }
  ];

  minutes = [
    { minuteInt: 59, description: 'N/A' },
    { minuteInt: 0, description: '00' },
    { minuteInt: 15, description: '15' },
    { minuteInt: 30, description: '30' },
    { minuteInt: 45, description: '45' },
  ];

  constructor() { }

  ngOnChanges( changes: SimpleChanges) {
    if ( changes.action ) {
      const seed = this.parseStart();
      if ( this.pickerForm ) {
        this.pickerForm.patchValue( {
          'formattedDate': seed.formattedDate,
          'startHour': seed.startHour,
          'startMinute': seed.startMinute,
          'ampm': seed.ampm,
          'shortTz': seed.shortTz,
          'duration': seed.duration
        });
      }
    }
  }

  ngOnInit() {
    const seed = this.parseStart();
    this.createForm(seed);
    this.onChanges();
    // this.copyFormToAction();
  }

  resetForm = () => {
    this.pickerForm.reset();
  }

  createForm = (seed: any) => {
    this.pickerForm = new FormGroup({
      formattedDate: new FormControl(seed.formattedDate, [Validators.required]),
      startHour: new FormControl(seed.startHour, [Validators.required]),
      startMinute: new FormControl(seed.startMinute, [Validators.required]),
      ampm: new FormControl(seed.ampm, [Validators.required]),
      shortTz: new FormControl(seed.shortTz, [Validators.required]),
      duration: new FormControl(seed.duration)

    });
  };

  get formattedDate() { return this.pickerForm.get('formattedDate'); }
  get startHour() { return this.pickerForm.get('startHour'); }
  get startMinute() { return this.pickerForm.get('startMinute'); }
  get ampm() { return this.pickerForm.get('ampm'); }
  get shortTz() { return this.pickerForm.get('shortTz'); }
  get duration() { return this.pickerForm.get('duration'); }

  parseStart(): any {
    const justTheDate = this.action.targetCompletionDate ? new Date(this.action.targetCompletionDate) : new Date();
    this.startMoment = moment.tz(justTheDate, this.userTimezone);
    const baseMinutes = this.startMoment.get('minutes') / 15;
    const startMinutes = _.floor(baseMinutes, 0) * 15;

    if ((this.startMoment.get('hours') !== 23 || this.startMoment.get('minutes') !== 59)) {
      this.startMoment.minutes(startMinutes);
      this.endMoment = this.action.targetCompletionDateEnd ? moment.tz(this.action.targetCompletionDateEnd, this.userTimezone) :
        this.startMoment.clone().add('minutes', 60)
    } else {
      this.endMoment = this.startMoment.clone();
    }

    const shortzones = countriesAndTimezones.getTimezonesForCountry('US').map( el => {
      const shortened =  {
        shortValue: moment.tz([this.startMoment.get('year'), this.startMoment.get('month')], el.name).format('z'),
        longValue: el.name
      };
      return shortened;
    });
    this.timeZones = shortzones;
    const possibleZones = this.timeZones.filter( el => el.longValue === this.userTimezone );
    let defaultShortTz = '';
    if (possibleZones && possibleZones.length > 0) {
      defaultShortTz = possibleZones[0];
    }
    return  {
      formattedDate: new Date(this.startMoment.format('YYYY-MM-DD hh:mm z')),
      startHour: this.startMoment.get('hours') > 12 ? this.startMoment.get('hours') - 12 : this.startMoment.get('hours'),
      startMinute: startMinutes,
      ampm: this.startMoment.get('hours') < 12 ? 'am' :
        (this.startMoment.get('hours') === 23 && this.startMoment.get('minutes') === 59) ? 'n/a' : 'pm',
      shortTz: defaultShortTz,
      duration: this.endMoment.diff(this.startMoment, 'minutes')
    };
  }

  onChanges = () => {
    // this.pickerForm.valueChanges.subscribe( val => {
    //   console.log('==================> ' + JSON.stringify(val));
    // });
    this.formattedDate.valueChanges.subscribe( val => {
        console.log('start moment ' + this.startMoment.format());
        this.dateChanged(moment(val));
    });
    this.startHour.valueChanges.subscribe( val => {
      console.log('start moment ' + this.startMoment);
      this.hourChanged(val);
    });
    this.startMinute.valueChanges.subscribe( val => {
      console.log('start moment ' + this.startMoment);
      this.minuteChanged(val);
    });
    this.ampm.valueChanges.subscribe( val => {
      console.log('start moment ' + this.startMoment);
      this.ampmChanged(val);
    });
    this.shortTz.valueChanges.subscribe( val => {
      console.log('start moment ' + this.startMoment);
      this.zoneChanged(val);
    });
    this.duration.valueChanges.subscribe( val => {
      console.log('start moment ' + this.startMoment);
      this.durationChanged(val);
    });
  };

  blockItOut = () => {
    console.log( '-----------------> BLOCK start hour ' + this.startMoment.hour() );
    console.log( '-----------------> BLOCK start minute ' + this.startMoment.minute() );

    if ( this.startMoment.hour() !== 23 ) { this.startHour.patchValue( 23 ); }
    if ( this.startMoment.minute() !== 59 ) { this.startMinute.patchValue(59); }
    this.ampm.patchValue('n/a');
    this.shortTz.patchValue({shortValue : 'n/a', longValue : 'n/a'} );
    this.duration.patchValue(0);
  };

  unblockItOut = () => {
    console.log( '-----------------> UNBLOCK start hour ' + this.startMoment.hour() );
    console.log( '-----------------> UNBLOCK start minute ' + this.startMoment.minute() );

    if ( this.startMoment.hour() === 23 ) { this.startHour.patchValue( 9 ); }
    if ( this.startMoment.minute() === 59 ) { this.startMinute.patchValue(0 ); }
    if ( this.shortTz.value === {shortValue : 'n/a', longValue : 'n/a'} ) { this.shortTz.patchValue(this.timeZones[0]); }
    if ( this.ampm.value === 'n/a' ) { this.ampm.patchValue('am'); }
  };

  dateChanged(newDate): void {
    console.log('date changed to ', newDate);
    this.startMoment.year(newDate.year());
    this.startMoment.month(newDate.month());
    this.startMoment.date(newDate.date());
    this.copyFormToAction();
  }

  hourChanged(startHour): void {
    console.log('hour changed to ' + startHour);
    if ( startHour === 99 ) {
      this.startMoment.hour( 23 );
      this.blockItOut();
    } else {
      if ( this.ampm.value === 'am' ) {
        this.startMoment.hour( startHour );
      } else {
        this.startMoment.hour( startHour + 12 );
      }
      this.unblockItOut();
    }
    this.copyFormToAction();
  }

  minuteChanged(startMinute): void {
    console.log('minute changed to ' + startMinute);
    this.startMoment.minute(startMinute);
    if ( startMinute === 59 ) {
      this.blockItOut();
    } else {
      this.unblockItOut();
    }
    this.copyFormToAction();
  }

  ampmChanged(ampm): void {
    console.log('ampm changed to ' + ampm);
    if ( ampm === 'am' ) {
      this.startMoment.hour( this.startHour.value );
    } else if ( ampm === 'pm' ) {
      this.startMoment.hour( (parseInt(this.startHour.value, 10) + 12) );
    }
    this.copyFormToAction();
  }

  zoneChanged(shortTz): void {
    console.log('zone changed to ' + shortTz);
    this.startMoment.tz(shortTz.longValue);
    this.copyFormToAction();
  }

  durationChanged(duration): void {
    console.log('duration changed to ' + duration);
    this.copyFormToAction();
  }

  copyFormToAction = () => {
    this.endMoment = this.startMoment.clone().add('minutes', this.duration.value);
    this.action.targetCompletionDate = this.startMoment.tz(this.userTimezone).format('YYYY-MM-DD HH:mm z');
    this.action.targetCompletionDateEnd = this.endMoment.tz(this.userTimezone).format('YYYY-MM-DD HH:mm z');
  };

  getActionTargetDescription = () => {
    const mommentTCD = moment(new Date(this.action.targetCompletionDate));
    const mommentTCDE = moment(new Date(this.action.targetCompletionDateEnd));
    const shortDate = mommentTCD.format('L');
    const lessShortDate = mommentTCD.format('LLL');
    const lessShortDateEnd = mommentTCDE.format('LLL');

    if ( mommentTCD.get('hours') === 23 && mommentTCD.get('minutes') === 59 ) {
      return 'Target date is ' + shortDate
    } if ( mommentTCD.isSame(mommentTCDE) ) {
      return 'Target date & time: ' + lessShortDate;
    } else {
      return 'Action: ' + lessShortDate + ' to ' + lessShortDateEnd;
    }

  };
}
