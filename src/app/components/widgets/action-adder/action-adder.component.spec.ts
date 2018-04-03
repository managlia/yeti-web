import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAdderComponent } from './action-adder.component';

describe('ActionAdderComponent', () => {
  let component: ActionAdderComponent;
  let fixture: ComponentFixture<ActionAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
