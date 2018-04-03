import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectCardComponent } from './prospect-card.component';

describe('ProspectCardComponent', () => {
  let component: ProspectCardComponent;
  let fixture: ComponentFixture<ProspectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
