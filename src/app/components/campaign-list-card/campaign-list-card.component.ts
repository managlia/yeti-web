import { Component, OnInit, Input, ViewChild, Renderer } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import { CampaignService } from '../../services/campaign.service';
import { Company } from '../../classes/company';
import { Contact } from '../../classes/contact';
import { Campaign } from '../../classes/campaign';
import { DataStore } from '../../classes/data-store';

@Component({
  selector: 'app-campaign-list-card',
  templateUrl: './campaign-list-card.component.html',
  styleUrls: ['./campaign-list-card.component.css']
})
export class CampaignListCardComponent implements OnInit {
  bgColor = 'white';

  campaign: Campaign;
  dataSource = new MatTableDataSource();
  displayedColumns = ['name', 'description', 'type'];
  @Input() actionId: string;
  @Input() companyId: string;
  @Input() contactId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private campaignService: CampaignService,
    public renderer: Renderer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.companyId) {
      console.log('load with comapny id ', this.companyId);
      this.campaignService.getCampaignListByCompany(this.companyId)
        .subscribe(campaigns => this.dataSource.data = campaigns);
    } else if (this.contactId) {
      this.campaignService.getCampaignListByContact( this.contactId )
        .subscribe(campaigns => this.dataSource.data = campaigns);
    } else if (this.actionId) {
      this.campaignService.getCampaignListByAction( this.actionId )
        .subscribe(campaigns => this.dataSource.data = campaigns);
    }
  }

  onSelectCampaign(campaign: Campaign) {
    this.router.navigateByUrl( `/campaign/${campaign.campaignId}` );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onConsideringCampaign($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setElementStyle(target, 'backgroundColor', 'lavender');
    this.renderer.setElementStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringCampaign($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setElementStyle(target, 'backgroundColor', this.bgColor);
  }

  addNewCampaign(): void {
    if (this.companyId) {
      console.log(`Going to add CAMPAIGN for the existing company ${this.companyId}`);
    } else if (this.contactId) {
      console.log(`Going to add CAMPAIGN for the existing contact ${this.contactId}`);
    } else if (this.actionId) {
      console.log(`Going to add CAMPAIGN for the existing action ${this.actionId}`);
    } else {
      console.log('Going to add CAMPAIGN for NOTHING');
    }
  }


}
