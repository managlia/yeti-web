import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { CardComponent } from '../base/card/card.component';
import { Company } from '../../classes/company';
import { CompanyOrContact } from '../../classes/common/company-or-contact';

@Component({
  selector: 'app-company-choice-card',
  templateUrl: './company-choice-card.component.html',
  styleUrls: ['./company-choice-card.component.css']
})
export class CompanyChoiceCardComponent extends CardComponent implements OnInit {

  @Output() selectCompany = new EventEmitter<Company>();
  @Output() onCompanyChosen = new EventEmitter<string>();

  myControl: FormControl = new FormControl();
  company: Company;
  results$: Observable<CompanyOrContact[]>;
  viewSearch = false;
  private searchTerms = new Subject<string>();

  ngOnInit() {
    if ( this.companyId ) {
      this.loadCustomer();
    } else {
      this.viewSearch = _.isUndefined(this.companyId);
    }
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.companyOrContactService.searchCompany(term)),
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  loadCustomer(): void {
    this.companyService.getCompany(this.companyId)
      .subscribe(company => this.company = company);
  }

  onOptionSelected(selectedCoc): void {
    this.companyId = selectedCoc.companyId;
    this.loadCustomer();
    this.viewSearch = false;
    this.onCompanyChosen.emit( this.companyId );
  }

  onCompanySelected(): void {
    this.selectCompany.emit(this.company);
  }

  resetCompany(): void {
    this.companyId = null;
    this.company = null;
    this.myControl = new FormControl();
    this.viewSearch = true;
  }
}
