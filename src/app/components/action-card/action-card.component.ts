import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import * as _ from 'lodash';

import { Action } from '../../classes/action';
import { CardComponent } from '../base/card/card.component';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
/* Component used to add and remove Actions from Company, Campaign, and Contact entities. */
export class ActionCardComponent extends CardComponent implements OnInit {

  @Output() onActionFlaggedForRemoval = new EventEmitter<any>();
  @Output() onActionAssociatedToEntity = new EventEmitter<any>();

  ngOnInit() {
    if (this.companyId) {
      this.getActionsByCustomerId();
    } else if (this.contactId) {
      this.getActionsByContactId();
    } else if (this.campaignId) {
      this.getActionsByCampaignId();
    } else {
      this.entities = [];
    }
  }

  getActionsByCustomerId(): void {
    this.actionService.getActionListByCompany( this.companyId )
      .subscribe(actions => this.entities = actions );
  }

  getActionsByContactId(): void {
    this.actionService.getActionListByContact( this.contactId )
      .subscribe(actions => this.entities = actions );
  }

  getActionsByCampaignId(): void {
    this.actionService.getActionListByCampaign( this.campaignId )
      .subscribe(actions => this.entities = actions );
  }

  onActionAdded(action: Action) {
   this.onActionAssociatedToEntity.emit( {entities: this.entities, action} );
  }

  removeAction(action: Action) {
    this.onActionFlaggedForRemoval.emit( {entities: this.entities, action} );
    _.remove(this.entities, {
      actionId: action.actionId
    });
  }

  createNewAction(): void {
    if (this.companyId) {
      this.router.navigateByUrl( `/action/add/company/${this.companyId}` );
    } else if (this.contactId) {
      this.router.navigateByUrl( `/action/add/contact/${this.contactId}` );
    } else if (this.campaignId) {
      this.router.navigateByUrl( `/action/add/campaign/${this.campaignId}` );
    }
  }

  onSelectedAction($event, actionId): void {
    this.router.navigateByUrl( `/action/${actionId}` );
  }
}
