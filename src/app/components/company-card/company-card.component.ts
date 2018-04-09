import {Component, OnInit, EventEmitter, Output} from '@angular/core';

import { CardComponent } from '../base/card/card.component';
import { Company } from '../../classes/company';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css']
})
export class CompanyCardComponent extends CardComponent implements OnInit {
  fontColor = 'black';

  displayedColumns = ['companyId', 'name', 'description'];

  @Output() onCompanyFlaggedForRemoval = new EventEmitter<string>();
  @Output() onCompanyAssociatedToEntity = new EventEmitter<Company>();

  ngOnInit(): void {
    if (this.campaignId) {
      this.companyService.getCompanyListByCampaign(this.campaignId)
        .subscribe(companies => this.entities = companies);
    } else if (this.contactId) {
      this.companyService.getCompanyListByContact( this.contactId )
        .subscribe(companies => this.entities = companies);
    } else if (this.actionId) {
      this.companyService.getCompanyListByAction( this.actionId )
        .subscribe(companies => this.entities = companies);
    } else {
      this.entities = [];
    }
  }

  onSelectCompany(company: Company) {
    this.router.navigateByUrl( `/company/${company.companyId}` );
  }

  onCompanyAdded(company: Company) {
    this.onCompanyAssociatedToEntity.emit(company);
    this.suspendedUndoEvent  = new Observable<any>(observer => {
      this.entities = this.entities.filter(e => e.companyId !== company.companyId);
      observer.next('undone');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  removeCompany(companyId: string) {
    this.onCompanyFlaggedForRemoval.emit(companyId);
    this.suspendedEvent = new Observable<any> ( observer => {
      this.entities = this.entities.filter( e => e.companyId !== companyId );
      observer.next('success');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  createNewCompany(): void {
    if (this.contactId) {
      this.router.navigateByUrl( `/company/add/contact/${this.contactId}` );
    } else if (this.actionId) {
      this.router.navigateByUrl( `/company/add/action/${this.actionId}` );
    } else if (this.campaignId) {
      this.router.navigateByUrl( `/company/add/campaign/${this.campaignId}` );
    }
  }

  onSelectedCompany($event, companyId): void {
    this.router.navigateByUrl( `/company/${companyId}` );
  }
}
