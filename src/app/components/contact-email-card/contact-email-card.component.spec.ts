import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEmailCardComponent } from './contact-email-card.component';

describe('ContactEmailCardComponent', () => {
  let component: ContactEmailCardComponent;
  let fixture: ComponentFixture<ContactEmailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactEmailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEmailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
