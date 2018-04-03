import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdderComponent } from './company-adder.component';

describe('CompanyAdderComponent', () => {
  let component: CompanyAdderComponent;
  let fixture: ComponentFixture<CompanyAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
