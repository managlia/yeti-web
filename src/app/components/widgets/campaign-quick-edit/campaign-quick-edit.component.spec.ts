import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignQuickEditComponent } from './campaign-quick-edit.component';

describe('CampaignQuickEditComponent', () => {
  let component: CampaignQuickEditComponent;
  let fixture: ComponentFixture<CampaignQuickEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignQuickEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignQuickEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
