import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeDetailsComponent } from './date-time-details.component';

describe('DateTimeDetailsComponent', () => {
  let component: DateTimeDetailsComponent;
  let fixture: ComponentFixture<DateTimeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
