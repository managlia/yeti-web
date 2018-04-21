import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatterDetailsComponent } from './chatter-details.component';

describe('ChatterDetailsComponent', () => {
  let component: ChatterDetailsComponent;
  let fixture: ComponentFixture<ChatterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
