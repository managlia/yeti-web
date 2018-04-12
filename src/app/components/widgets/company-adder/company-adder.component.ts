import {Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import {AdderComponent} from '../../base/adder/adder.component';
import {CompanyOrContact} from '../../../classes/common/company-or-contact';
import {Company} from '../../../classes/company';

@Component({
  selector: 'app-company-adder',
  templateUrl: './company-adder.component.html',
  styleUrls: ['./company-adder.component.css']
})
export class CompanyAdderComponent extends AdderComponent implements OnInit {

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.companyOrContactService.searchCompany(term) ),
    );
    this.results$
      .subscribe(results => this.results = this.excludeAlreadyAssociated(results, this.existingEntities) );
  }

  onOptionSelected(selectedItem: CompanyOrContact): void {
    const companyId = selectedItem.companyId;
    this.companyService.getCompany(companyId)
      .subscribe(company => {
        this.existingEntities.push(company);
        this.onEntityAdded.emit(company);
        this.viewSearch = false;
      } );
  }

  excludeAlreadyAssociated(resultElements: CompanyOrContact[], filterArray: Company[]) {
    const filteredArray = _.filter(resultElements, function(o) {
      const matchId = o.companyId;
      const compareList = _.map(filterArray, 'companyId' );
      const isMatch = _.indexOf( compareList,  matchId) > -1;
      return !isMatch;
    });
    return filteredArray;
  }
}
