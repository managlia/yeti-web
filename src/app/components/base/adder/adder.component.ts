import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CampaignOrActionService} from '../../../services/campaign-or-action.service';
import {ActivatedRoute} from '@angular/router';
import {ActionService} from '../../../services/action.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {CampaignOrAction} from '../../../classes/common/campaign-or-action';
import {FormControl} from '@angular/forms';
import * as label from '../../labels';
import {CompanyOrContactService} from '../../../services/company-or-contact.service';
import {CampaignService} from '../../../services/campaign.service';
import {CompanyService} from '../../../services/company.service';
import {ContactService} from '../../../services/contact.service';
import {TeamService} from '../../../services/team.service';
import {DataStore} from '../../../classes/data-store';

@Component({
  selector: 'app-adder',
  templateUrl: './adder.component.html',
  styleUrls: ['./adder.component.scss']
})
export class AdderComponent {

  resourceId = DataStore.userId;
  @Output() onEntityAdded = new EventEmitter<any>();
  @Input() existingEntities: any[];

  results: CampaignOrAction[];
  results$: Observable<any[]>;
  searchTerms = new Subject<string>();
  myControl: FormControl = new FormControl();
  viewSearch = false;
  public readonly label = label;

  constructor(
    public route: ActivatedRoute,
    public campaignOrActionService: CampaignOrActionService,
    public companyOrContactService: CompanyOrContactService,
    public actionService: ActionService,
    public campaignService: CampaignService,
    public companyService: CompanyService,
    public contactService: ContactService,
    public teamService: TeamService
  ) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  addNewEntity(): void {
    this.myControl = new FormControl();
    this.viewSearch = true;
  }
}
