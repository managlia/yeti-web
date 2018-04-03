import {Component, OnInit, Input, ViewChild, Renderer, AfterViewInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ActionClassificationTypeService } from '../../services/action-classification-type.service';

import { ActionContactService } from '../../services/action-contact.service';
import { ActionService } from '../../services/action.service';
import { Action } from '../../classes/action';
import {ActionClassificationType} from '../../classes/types/action-classification-type';
import {ActionClassificationOtherTypeService} from '../../services/action-classification-other-type.service';
import {ActionClassificationOtherType} from '../../classes/types/action-classification-other-type';
import {ScopeType} from '../../classes/types/scope-type';
import {ScopeTypeService} from '../../services/scope-type.service';

@Component({
  selector: 'app-action-list-card',
  templateUrl: './action-list-card.component.html',
  styleUrls: ['./action-list-card.component.css']
})
export class ActionListCardComponent implements OnInit, AfterViewInit {
  bgColor = 'white';
  fullEdit = false;
  activeFilter = 'true';
  textFilter = '';
  action: Action;
  dataSource = new MatTableDataSource();
  classificationOtherTypes: Observable<ActionClassificationOtherType[]>;
  classificationTypes: ActionClassificationType[];
  scopeTypes: ScopeType[];

  shortList = ['name', 'description', 'type'];
  fullList = ['name', 'description', 'type', 'scope', 'deleteAction', 'editAction', 'active'];

  displayedColumns = this.fullList;
  @Input() companyId: string;
  @Input() contactId: string;
  @Input() campaignId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private actionContactService: ActionContactService,
    private actionService: ActionService,
    private actionClassificationTypeService: ActionClassificationTypeService,
    private actionClassificationOtherTypeService: ActionClassificationOtherTypeService,
    private scopeTypeService: ScopeTypeService,
    public renderer: Renderer,
    private router: Router
  ) {
    this. getClassificationTypes();
    this.classificationOtherTypes = this.actionClassificationOtherTypeService.getActionClassificationOtherTypeList();
    this.getScopeTypes();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter =  JSON.stringify({
        general: '',
      activeStatus: 'true'
    });
    this.fullEdit = false;
    this.displayedColumns = this.shortList;

    if (this.companyId) {
      this.actionService.getActionListByCompany(this.companyId)
        .subscribe(actions => this.dataSource.data = actions);
    } else if (this.contactId) {
      this.actionService.getActionListByContact( this.contactId )
        .subscribe(actions => this.dataSource.data = actions);
    } else if (this.campaignId) {
      this.actionService.getActionListByCampaign( this.campaignId )
        .subscribe(actions => this.dataSource.data = actions);
    } else {
      console.log('********** LOADING ALL ACTIONS *************');
      this.fullEdit = true;
      this.displayedColumns = this.fullList;
      this.actionService.getActionList()
        .subscribe(actions => this.dataSource.data = actions);
    }
  }

  onSelectAction(action: Action) {
    this.router.navigateByUrl( `/action/${action.actionId}` );
  }

  setClassificationForAction(classificationType: ActionClassificationType, action: Action) {
      console.log('doing classificationType ', classificationType);
      console.log('doing classificationType update for action ', action);
      action.classificationType = classificationType;
      this.updateIfReady( action );
  }

  setScopeForAction(scopeType: ScopeType, action: Action) {
    console.log('doing scopeType ', scopeType);
    console.log('doing scopeType update for action ', action);
    action.scopeType = scopeType;
    this.updateIfReady( action );
  }

  updateIfReady(action: Action) {
    if (action.classificationType && action.scopeType) {
      this.actionService.getAction( action.actionId ).subscribe( cleanAction => {
        cleanAction.scopeType = action.scopeType;
        cleanAction.classificationType = action.classificationType;
        this.actionService.updateAction(cleanAction)
          .subscribe(feedback => console.log('UPDATED: Now change the record in the list', feedback) );
      });
    } else {
      console.log('not set to update');
    }
  }

  deleteAction( action: Action ) {
    console.log('Hard delete of action ', action);
    this.actionService.deleteAction(action.actionId)
      .subscribe(feedback => {
        console.log('DELETED: Now I should remove the record from the list because it was deleted.', feedback);
        console.log( 'size of data source now ' + this.dataSource.data.length );
        this.dataSource.data = this.dataSource.data.filter(e => e !== action );
        console.log( 'size of data source later ' + this.dataSource.data.length );
      });
  }

  applyFilters() {
    this.textFilter = this.textFilter.trim(); // Remove whitespace
    this.textFilter = this.textFilter.toLowerCase(); // Datasource defaults to lowercase matches
    const filterValues = {
      general: this.textFilter,
      activeStatus: this.activeFilter
    };
    console.log(JSON.stringify(filterValues));
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = function(data, filter) : boolean {
      const searchTerms = JSON.parse(filter);
      return (
          data.name.toString().toLowerCase().indexOf(searchTerms.general) !== -1
       || data.description.toString().toLowerCase().indexOf(searchTerms.general) !== -1)
       && (searchTerms.activeStatus === 'all' || data.active === (searchTerms.activeStatus === 'true'))
    };
    return filterFunction
  }


  onConsideringAction($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setElementStyle(target, 'backgroundColor', 'lavender');
    this.renderer.setElementStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringAction($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setElementStyle(target, 'backgroundColor', this.bgColor);
  }

  addNewAction(): void {
    if (this.companyId) {
      console.log(`Going to add ACTION for the existing company ${this.companyId}`);
    } else if (this.contactId) {
      console.log(`Going to add ACTION for the existing contact ${this.contactId}`);
    } else if (this.campaignId) {
      console.log(`Going to add ACTION for the existing campaign ${this.campaignId}`);
    } else {
      console.log('Going to add ACTION for NOTHING');
      this.router.navigateByUrl( `/action` );
    }
  }

  getClassificationTypes(): void {
    this.actionClassificationTypeService.getActionClassificationTypeList()
      .subscribe(classificationTypes => this.classificationTypes = classificationTypes);
  }

  getScopeTypes(): void {
    this.scopeTypeService.getScopeTypeList()
      .subscribe(scopeTypes => this.scopeTypes = scopeTypes);
  }

}
