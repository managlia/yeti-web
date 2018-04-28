import {Component, Input, OnInit, SimpleChanges, OnChanges, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-simple-slider',
  templateUrl: './simple-slider.component.html',
  styleUrls: ['./simple-slider.component.scss']
})
export class SimpleSliderComponent implements OnInit, OnChanges {

  @Output() valueChanged = new EventEmitter<number>();
  @Input() aLabel: string;
  @Input() aValue: number;

  sliderForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.sliderForm = new FormGroup({
      slideValue: new FormControl( this.aValue, [Validators.required])
    });
    this.onChanges();
  }

  ngOnChanges( changes: SimpleChanges) {
    if ( changes.aValue && this.sliderForm ) {
      this.sliderForm.patchValue( { 'slideValue': this.aValue });
      this.onChanges();
    }
  }

  onChanges = () => {
    this.slideValue.valueChanges.subscribe( val => {
      this.valueChanged.emit( parseInt( val, 10)  );
    });
  };

  get slideValue() { return this.sliderForm.get('slideValue'); }
}
