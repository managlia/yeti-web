import {Component, OnInit, Input, ViewChild, Renderer2, AfterViewInit, ElementRef} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';

import {ActionClassificationTypeService} from '../../services/action-classification-type.service';
import {ActionContactService} from '../../services/action-contact.service';
import {ActionService} from '../../services/action.service';
import {Action} from '../../classes/action';
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

  @Input() companyId: string;
  @Input() contactId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  bgColor = 'white';
  activeFilter = 'true';
  scopeFilter: string;
  typeFilter: string;
  deleteableStatus: boolean;
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify({
      general: '',
      activeStatus: 'true',
      deleteableStatus: 'all',
      scopeStatus: 'all',
      typeStatus: 'all'
    });
    this.fullEdit = false;
    this.displayedColumns = this.shortList;
    if (this.companyId) {
      this.actionService.getActionListByCompany(this.companyId)
        .subscribe(actions => {
          this.fullEdit = true;
          this.displayedColumns = this.fullList;
          this.dataSource.data = actions;
        });
    } else if (this.contactId) {
      this.actionService.getActionListByContact(this.contactId)
        .subscribe(actions => {
          this.fullEdit = true;
          this.displayedColumns = this.fullList;
          this.dataSource.data = actions;
        });
    } else {
      this.fullEdit = true;
      this.displayedColumns = this.fullList;
      this.actionService.getActionList()
        .subscribe(actions => this.dataSource.data = actions);
    }
  }

  addNewAction(): void {
    if (this.companyId) {
      this.router.navigateByUrl(`/action/add/company/${this.companyId}`);
    } else if (this.contactId) {
      this.router.navigateByUrl(`/action/add/contact/${this.contactId}`);
    } else {
      this.router.navigateByUrl(`/action`);
    }
  }

  onSelectAction = (action: Action) => {
    const data = {
      dataSource: this.dataSource,
      action: action,
      classificationTypes: this.classificationTypes,
      classificationOtherTypes: this.classificationOtherTypes,
      scopeTypes: this.scopeTypes
    };
    this.actionQuickEditService.openDialog(data)
      .subscribe(result => {
        console.log('Does anything need to be done here????');
      });
  }

  applyFilters() {
    this.textFilter = this.textFilter.trim(); // Remove whitespace
    this.textFilter = this.textFilter.toLowerCase(); // Datasource defaults to lowercase matches
    const filterValues = {
      general: this.textFilter,
      activeStatus: this.activeFilter,
      scopeStatus: this.scopeFilter ? this.scopeFilter : 'all',
      typeStatus: this.typeFilter ? this.typeFilter : 'all',
      deleteableStatus: this.deleteableStatus ? this.deleteableStatus : 'all'
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      return (
        data.name.toString().toLowerCase().indexOf(searchTerms.general) !== -1
        || data.description.toString().toLowerCase().indexOf(searchTerms.general) !== -1)
        && (searchTerms.activeStatus === 'all' || data.active === (searchTerms.activeStatus === 'true'))
        && (searchTerms.deleteableStatus === 'all' || data.deleteable === (searchTerms.deleteableStatus === 'true'))
        && (searchTerms.scopeStatus === 'all' || (data.scopeType && (data.scopeType.scopeTypeId === searchTerms.scopeStatus)))
        && (searchTerms.typeStatus === 'all' || (data.classificationType &&
           (data.classificationType.actionClassificationTypeId === searchTerms.typeStatus)))
    };
    return filterFunction
  }

  onConsideringAction($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
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
