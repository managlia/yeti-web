import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import * as _ from 'lodash';

import {Action} from '../../classes/action';
import {CardComponent} from '../base/card/card.component';
import {Observable} from 'rxjs/Observable';

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
    this.actionService.getActionListByCompany(this.companyId)
      .subscribe(actions => this.entities = actions);
  }

  getActionsByContactId(): void {
    this.actionService.getActionListByContact(this.contactId)
      .subscribe(actions => this.entities = actions);
  }

  getActionsByCampaignId(): void {
    this.actionService.getActionListByCampaign(this.campaignId)
      .subscribe(actions => this.entities = actions);
  }

  onActionAdded(action: Action) {
    this.onActionAssociatedToEntity.emit(action);
    this.suspendedUndoEvent  = new Observable<any>(observer => {
      this.entities = this.entities.filter(e => e.actionId !== action.actionId);
      observer.next('undone');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  removeAction(actionId: string) {
    this.onActionFlaggedForRemoval.emit(actionId);
    this.suspendedEvent = new Observable<any>(observer => {
      this.entities = this.entities.filter(e => e.actionId !== actionId);
      observer.next('success');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  createNewAction(): void {
    if (this.companyId) {
      this.router.navigateByUrl(`/action/add/company/${this.companyId}`);
    } else if (this.contactId) {
      this.router.navigateByUrl(`/action/add/contact/${this.contactId}`);
    } else if (this.campaignId) {
      this.router.navigateByUrl(`/action/add/campaign/${this.campaignId}`);
    }
  }

  onSelectedAction($event, actionId): void {
    this.router.navigateByUrl(`/action/${actionId}`);
  }
}
