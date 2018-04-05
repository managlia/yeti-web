import {Component, OnInit, Input, ViewChild, Renderer2, AfterViewInit, ElementRef} from '@angular/core';
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
import {ActionQuickEditService} from '../widgets/action-quick-edit.service';
import * as label from '../labels';

@Component({
  selector: 'app-action-list-card',
  templateUrl: './action-list-card.component.html',
  styleUrls: ['./action-list-card.component.css']
})
export class ActionListCardComponent implements OnInit, AfterViewInit {

  @ViewChild('something', {read: ElementRef}) something: ElementRef;

  dataSource = new MatTableDataSource();

  bgColor = 'white';
  activeFilter = 'true';
  textFilter = '';
  action: Action;
  classificationOtherTypes: ActionClassificationOtherType[];
  classificationTypes: ActionClassificationType[];
  scopeTypes: ScopeType[];
  public readonly label = label;

  fullEdit = false;
  shortList = ['name', 'description', 'type'];
  fullList = ['name', 'description', 'type', 'deleteAction', 'scope', 'active'];

  displayedColumns: string[] = null;
  @Input() companyId: string;
  @Input() contactId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private actionContactService: ActionContactService,
    private actionService: ActionService,
    private actionClassificationTypeService: ActionClassificationTypeService,
    private actionClassificationOtherTypeService: ActionClassificationOtherTypeService,
    private scopeTypeService: ScopeTypeService,
    public renderer: Renderer2,
    private router: Router,
    private actionQuickEditService: ActionQuickEditService
  ) {
    this.getClassificationTypes();
    this.getClassificationOtherTypes();
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
    } else {
      this.fullEdit = true;
      this.displayedColumns = this.fullList;
      this.actionService.getActionList()
        .subscribe(actions => this.dataSource.data = actions);
    }
  }

  addNewAction(): void {
    if (this.companyId) {
      this.router.navigateByUrl( `/action/add/company/${this.companyId}` );
    } else if (this.contactId) {
      this.router.navigateByUrl( `/action/add/contact/${this.contactId}` );
    } else {
      this.router.navigateByUrl( `/action` );
    }
  }

  onSelectAction = (action: Action) => {
    // this.router.navigateByUrl( `/action/${action.actionId}` );
    const data = {
      dataSource: this.dataSource,
      action: action,
      classificationTypes: this.classificationTypes,
      classificationOtherTypes: this.classificationOtherTypes,
      scopeTypes: this.scopeTypes
    };
    this.actionQuickEditService.openDialog(data)
      .subscribe(result => {
        console.log('Gotta think what will be done here');
      });
  }

  setClassificationForAction(classificationType: ActionClassificationType, action: Action) {
      action.classificationType = classificationType;
      this.updateIfReady( action );
  }

  setScopeForAction(scopeType: ScopeType, action: Action) {
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
    this.actionService.deleteAction(action.actionId)
      .subscribe(feedback => this.dataSource.data = this.dataSource.data.filter(e => e !== action ) );
  }

  applyFilters() {
    this.textFilter = this.textFilter.trim(); // Remove whitespace
    this.textFilter = this.textFilter.toLowerCase(); // Datasource defaults to lowercase matches
    const filterValues = {
      general: this.textFilter,
      activeStatus: this.activeFilter
    };
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
    console.log('something', this.something);


    this.renderer.setStyle(target, 'backgroundColor', 'lavender');
    this.renderer.setStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringAction($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setStyle(target, 'backgroundColor', this.bgColor);
  }

  getClassificationTypes(): void {
    this.actionClassificationTypeService.getActionClassificationTypeList()
      .subscribe(classificationTypes => this.classificationTypes = classificationTypes);
  }

  getClassificationOtherTypes(): void {
    this.actionClassificationOtherTypeService.getActionClassificationOtherTypeList()
      .subscribe(classificationOtherTypes => this.classificationOtherTypes = classificationOtherTypes);
  }

  getScopeTypes(): void {
    this.scopeTypeService.getScopeTypeList()
      .subscribe(scopeTypes => this.scopeTypes = scopeTypes);
  }
}
