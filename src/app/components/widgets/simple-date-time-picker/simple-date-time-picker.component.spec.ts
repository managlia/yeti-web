import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDateTimePickerComponent } from './simple-date-time-picker.component';

describe('SimpleDateTimePickerComponent', () => {
  let component: SimpleDateTimePickerComponent;
  let fixture: ComponentFixture<SimpleDateTimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDateTimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
