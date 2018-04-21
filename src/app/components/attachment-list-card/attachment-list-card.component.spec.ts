import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentListCardComponent } from './attachment-list-card.component';

describe('AttachmentListCardComponent', () => {
  let component: AttachmentListCardComponent;
  let fixture: ComponentFixture<AttachmentListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
