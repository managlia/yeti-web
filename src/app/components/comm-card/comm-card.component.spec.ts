import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommCardComponent } from './comm-card.component';

describe('CommCardComponent', () => {
  let component: CommCardComponent;
  let fixture: ComponentFixture<CommCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
