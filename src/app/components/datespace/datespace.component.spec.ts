import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatespaceComponent } from './datespace.component';

describe('DatespaceComponent', () => {
  let component: DatespaceComponent;
  let fixture: ComponentFixture<DatespaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatespaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatespaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
