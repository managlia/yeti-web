import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientCardComponent } from './recipient-card.component';

describe('RecipientCardComponent', () => {
  let component: RecipientCardComponent;
  let fixture: ComponentFixture<RecipientCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipientCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
