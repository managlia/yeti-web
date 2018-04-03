import {Component, OnInit, OnChanges, Input, Output, Renderer, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ElectronService } from 'ngx-electron';


import { Action } from '../../classes/action';
import { ActionService } from '../../services/action.service';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})

export class ActionCardComponent implements OnInit {

  @Input() companyId: string;
  @Input() contactId: string;
  @Input() campaignId: string;
  @Input() associationSuccessful = false;
  @Output() onActionFlaggedForRemoval = new EventEmitter<Action>();
  @Output() onActionAssociatedToEntity = new EventEmitter<Action>();

  actions: Action[];

  fontColor = 'black';

  constructor(
    private actionService: ActionService,
    public renderer: Renderer,
    private router: Router,
    private electronService: ElectronService
  ) {}

  sendActionStatus( status: String ) {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.sendToHost('action-status', status);
    }
  }

  ngOnInit() {
    console.log('-------------------------> -----------------------> isElectronApp:: ', this.electronService.isElectronApp);
    this.sendActionStatus('viewing actions on page');
    console.log(`companyCardComponent this.companyId is ${this.companyId}`);
    console.log(`companyCardComponent this.contactId is ${this.contactId}`);
    console.log(`companyCardComponent this.campaignId is ${this.campaignId}`);
    if (this.companyId) {
      this.getActionsByCustomerId();
    } else if (this.contactId) {
      this.getActionsByContactId();
    } else if (this.campaignId) {
      this.getActionsByCampaignId();
    } else {
      this.actions = [];
    }
  }


  onActionAdded(action: Action) {
    console.log('onActionAdded / onActionAssociatedToEntity');
    this.onActionAssociatedToEntity.emit(action);
    this.sendActionStatus('an action was added');
  }

  removeAction(action: Action) {
    this.onActionFlaggedForRemoval.emit(action);
    _.remove(this.actions, {
      actionId: action.actionId
    });
    this.sendActionStatus('an action was removed');
  }

  getActionsByCustomerId(): void {
    this.actionService.getActionListByCompany( this.companyId )
      .subscribe(actions => this.actions = actions );
  }

  getActionsByContactId(): void {
    console.log(`dfmdfm getting actions by contact id ${this.contactId}`);
    this.actionService.getActionListByContact( this.contactId )
      .subscribe(actions => this.actions = actions );
  }

  getActionsByCampaignId(): void {
    this.actionService.getActionListByCampaign( this.campaignId )
      .subscribe(actions => this.actions = actions );
  }

  createNewAction(): void {
    this.sendActionStatus('routed away');

    console.log('ready to add a new action');
    if (this.companyId) {
      this.router.navigateByUrl( `/action/add/company/${this.companyId}` );
    } else if (this.contactId) {
      this.router.navigateByUrl( `/action/add/contact/${this.contactId}` );
    } else if (this.campaignId) {
      this.router.navigateByUrl( `/action/add/campaign/${this.campaignId}` );
    }
  }

  onConsideringAction($event, thediv): void {
    this.sendActionStatus('considering an action');
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setElementStyle(target, 'color', 'rebeccapurple');
    this.renderer.setElementStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringAction($event, thediv): void {
    this.sendActionStatus('unconsidering an action');
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setElementStyle(target, 'color', this.fontColor);
  }

  onSelectedAction($event, actionId): void {
    this.sendActionStatus(`NOW clicked on ${actionId}`);
    console.log(`clicked on ${actionId}`);
    this.router.navigateByUrl( `/action/${actionId}` );
  }

}

