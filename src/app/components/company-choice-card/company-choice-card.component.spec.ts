import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyChoiceCardComponent } from './company-choice-card.component';

describe('CompanyChoiceCardComponent', () => {
  let component: CompanyChoiceCardComponent;
  let fixture: ComponentFixture<CompanyChoiceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyChoiceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyChoiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
