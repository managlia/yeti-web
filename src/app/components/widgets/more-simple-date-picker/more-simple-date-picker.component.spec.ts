import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreSimpleDatePickerComponent } from './more-simple-date-picker.component';

describe('MoreSimpleDatePickerComponent', () => {
  let component: MoreSimpleDatePickerComponent;
  let fixture: ComponentFixture<MoreSimpleDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreSimpleDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreSimpleDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
