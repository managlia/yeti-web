import {Component, OnInit, Input, AfterViewInit, ViewChild, Renderer, EventEmitter, Output} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { CompanyService } from '../../services/company.service';
import { Campaign } from '../../classes/campaign';
import { Company } from '../../classes/company';
import { Action } from '../../classes/action';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css']
})
export class CompanyCardComponent implements OnInit, AfterViewInit {
  fontColor = 'black';

  companies: Company[];
  displayedColumns = ['companyId', 'name', 'description'];
  @Input() campaignId: string;
  @Input() contactId: string;
  @Input() actionId: string;
  @Input() associationSuccessful = false;
  @Output() onCompanyFlaggedForRemoval = new EventEmitter<Company>();
  @Output() onCompanyAssociatedToEntity = new EventEmitter<Company>();

  constructor(
    private companyService: CompanyService,
    public renderer: Renderer,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.campaignId) {
      console.log('load with campaign id ', this.campaignId);
      this.companyService.getCompanyListByCampaign(this.campaignId)
        .subscribe(companies => this.companies = companies);
    } else if (this.contactId) {
      this.companyService.getCompanyListByContact( this.contactId )
        .subscribe(companies => this.companies = companies);
    } else if (this.actionId) {
      this.companyService.getCompanyListByAction( this.actionId )
        .subscribe(companies => this.companies = companies);
    } else {
      this.companies = [];
    }
  }

  ngAfterViewInit() {
  }

  onSelectCompany(company: Company) {
    this.router.navigateByUrl( `/company/${company.companyId}` );
  }

  onCompanyAdded(company: Company) {
    console.log('onCompanyAdded / onCompanyAssociatedToEntity');
    this.onCompanyAssociatedToEntity.emit(company);
  }

  removeCompany(company: Company) {
    this.onCompanyFlaggedForRemoval.emit(company);
    _.remove(this.companies, {
      companyId: company.companyId
    });
  }

  createNewCompany(): void {
    console.log('ready to add a new company');
    console.log('ready to add a new company:: contactId: ' + this.contactId);
    console.log('ready to add a new company:: actionId: ' + this.actionId);
    console.log('ready to add a new company:: campaignId: ' + this.campaignId);
    console.log('ready to add a new company');
    if (this.contactId) {
      this.router.navigateByUrl( `/company/add/contact/${this.contactId}` );
    } else if (this.actionId) {
      this.router.navigateByUrl( `/company/add/action/${this.actionId}` );
    } else if (this.campaignId) {
      this.router.navigateByUrl( `/company/add/campaign/${this.campaignId}` );
    }
  }

  onConsideringCompany($event, thediv): void {
    const target =  event.currentTarget || event.target || event.srcElement ;
    this.renderer.setElementStyle(target, 'color', 'rebeccapurple');
    this.renderer.setElementStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringCompany($event, thediv): void {
    const target =  event.currentTarget || event.target || event.srcElement ;
    this.renderer.setElementStyle(target, 'color', this.fontColor);
  }

  onSelectedCompany($event, companyId): void {
    console.log(`clicked on ${companyId}`);
    this.router.navigateByUrl( `/company/${companyId}` );
  }

}
