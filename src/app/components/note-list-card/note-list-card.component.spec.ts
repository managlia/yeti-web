import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteListCardComponent } from './note-list-card.component';

describe('NoteListCardComponent', () => {
  let component: NoteListCardComponent;
  let fixture: ComponentFixture<NoteListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
