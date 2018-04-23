import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFilterCardComponent } from './team-filter-card.component';

describe('TeamFilterCardComponent', () => {
  let component: TeamFilterCardComponent;
  let fixture: ComponentFixture<TeamFilterCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamFilterCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamFilterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
