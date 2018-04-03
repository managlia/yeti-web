import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignListCardComponent } from './campaign-list-card.component';

describe('CampaignListCardComponent', () => {
  let component: CampaignListCardComponent;
  let fixture: ComponentFixture<CampaignListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
