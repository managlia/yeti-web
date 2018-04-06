import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionQuickEditComponent } from './action-quick-edit.component';

describe('ActionQuickEditComponent', () => {
  let component: ActionQuickEditComponent;
  let fixture: ComponentFixture<ActionQuickEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionQuickEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionQuickEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
