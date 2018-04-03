import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAdderComponent } from './contact-adder.component';

describe('ContactAdderComponent', () => {
  let component: ContactAdderComponent;
  let fixture: ComponentFixture<ContactAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
