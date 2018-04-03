import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionListCardComponent } from './action-list-card.component';

describe('ActionListCardComponent', () => {
  let component: ActionListCardComponent;
  let fixture: ComponentFixture<ActionListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
