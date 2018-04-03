import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {Observable } from 'rxjs/Observable';
import { CompanyOrContact } from '../../../classes/common/company-or-contact';
import { Company } from '../../../classes/company';
import { CompanyOrContactService } from '../../../services/company-or-contact.service';
import { CompanyService } from '../../../services/company.service';
import {FormControl} from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-adder',
  templateUrl: './company-adder.component.html',
  styleUrls: ['./company-adder.component.css']
})
export class CompanyAdderComponent implements OnInit {
  myControl: FormControl = new FormControl();

  @Input() existingCompanies: Company[];
  @Output() onCompanyAdded = new EventEmitter<Company>();
  results$: Observable<CompanyOrContact[]>;
  results: CompanyOrContact[];
  viewSearch = false;

  private searchTerms = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private companyOrContactService: CompanyOrContactService,
    private companyService: CompanyService
  ) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  addNewCompany(): void {
    this.myControl = new FormControl();
    this.viewSearch = true;
  }

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.companyOrContactService.searchCompany(term)),
    );

    this.results$
      .subscribe(results => this.results = this.excludeAlreadyAssociated(results, this.existingCompanies) );
  }

  onOptionSelected(selectedCoc): void {
    const companyId = selectedCoc.companyId;
    console.log( `gotta get the company id for ${companyId}`);
    this.companyService.getCompany(companyId)
      .subscribe(company => {
        this.existingCompanies.push(company);
        console.log('onOptionSelected / onContactAdded');
        this.onCompanyAdded.emit(company);
      } );
    this.viewSearch = false;
  }

  excludeAlreadyAssociated(resultElements: CompanyOrContact[], filterArray: Company[]) {
    console.log( 'result elements', resultElements  );
    console.log( 'filter array', filterArray  );

    const filteredArray = _.filter(resultElements, function(o) {
      const matchId = o.companyId;
      const compareList = _.map(filterArray, 'companyId' );
      const isMatch = _.indexOf( compareList,  matchId) > -1;
      return !isMatch;
    });
    return filteredArray;
  }


}
