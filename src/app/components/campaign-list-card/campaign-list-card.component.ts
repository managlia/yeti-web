import { Component, OnInit, Input, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import { CampaignClassificationTypeService } from '../../services/campaign-classification-type.service';
import { CampaignService } from '../../services/campaign.service';
import { CampaignClassificationType } from '../../classes/types/campaign-classification-type';
import { Campaign } from '../../classes/campaign';
import {ScopeType} from '../../classes/types/scope-type';
import {ScopeTypeService} from '../../services/scope-type.service';
import {CampaignQuickEditService} from '../widgets/campaign-quick-edit.service';
import * as label from '../labels';

@Component({
  selector: 'app-campaign-list-card',
  templateUrl: './campaign-list-card.component.html',
  styleUrls: ['./campaign-list-card.component.css']
})
export class CampaignListCardComponent implements OnInit, AfterViewInit {

  @Input() companyId: string;
  @Input() contactId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  bgColor = 'white';
  activeFilter = 'true';
  typeFilter: string;
  textFilter = '';

  classificationTypes: CampaignClassificationType[];
  scopeTypes: ScopeType[];
  public readonly label = label;
  displayedColumns = ['name', 'description', 'type', 'active'];

  constructor(
    private campaignService: CampaignService,
    private campaignClassificationTypeService: CampaignClassificationTypeService,
    private scopeTypeService: ScopeTypeService,
    public renderer: Renderer2,
    private router: Router,
    private campaignQuickEditService: CampaignQuickEditService
  ) {
    this.getClassificationTypes();
    this.getScopeTypes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify({
      general: '',
      activeStatus: 'true',
      typeStatus: 'all'
    });
    if (this.companyId) {
      this.campaignService.getCampaignListByCompany(this.companyId)
        .subscribe(campaigns => this.dataSource.data = campaigns);
    } else if (this.contactId) {
      this.campaignService.getCampaignListByContact( this.contactId )
        .subscribe(campaigns => this.dataSource.data = campaigns);
    }
  }

  addNewCampaign(): void {
  if (this.companyId) {
      this.router.navigateByUrl(`/campaign/add/company/${this.companyId}`);
    } else if (this.contactId) {
      this.router.navigateByUrl(`/campaign/add/contact/${this.contactId}`);
    } else {
      this.router.navigateByUrl(`/campaign`);
    }
  }

  onSelectCampaign(campaign: Campaign) {
    const data = {
      dataSource: this.dataSource,
      campaign: campaign,
      classificationTypes: this.classificationTypes,
      scopeTypes: this.scopeTypes
    };
    this.campaignQuickEditService.openDialog(data)
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
      typeStatus: this.typeFilter ? this.typeFilter : 'all',
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
        && (searchTerms.typeStatus === 'all' || (data.classificationType &&
           (data.classificationType.campaignClassificationTypeId === searchTerms.typeStatus)))
    };
    return filterFunction
  }
  onConsideringCampaign($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setStyle(target, 'backgroundColor', 'lavender');
    this.renderer.setStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringCampaign($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setStyle(target, 'backgroundColor', this.bgColor);
  }

  getClassificationTypes(): void {
    this.campaignClassificationTypeService.getCampaignClassificationTypeList()
      .subscribe(classificationTypes => this.classificationTypes = classificationTypes);
  }
  getScopeTypes(): void {
    this.scopeTypeService.getScopeTypeList()
      .subscribe(scopeTypes => this.scopeTypes = scopeTypes);
  }
}
