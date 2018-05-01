import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommListCardComponent } from './comm-list-card.component';

describe('CommListCardComponent', () => {
  let component: CommListCardComponent;
  let fixture: ComponentFixture<CommListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
