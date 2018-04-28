import {Component, Input, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import {AdderComponent} from '../../base/adder/adder.component';
import {CompanyOrContact} from '../../../classes/common/company-or-contact';
import {Contact} from '../../../classes/contact';

@Component({
  selector: 'app-contact-adder',
  templateUrl: './contact-adder.component.html',
  styleUrls: ['./contact-adder.component.css']
})
export class ContactAdderComponent extends AdderComponent implements OnInit {

  @Input() hostOnly = false;

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.companyOrContactService.searchContact(term, this.hostOnly) ),
    );
    this.results$
      .subscribe(results => this.results = this.excludeAlreadyAssociated(results, this.existingEntities) );
  }

  onOptionSelected(selectedItem: CompanyOrContact): void {
    const contactId = selectedItem.contactId;
    this.contactService.getContact(contactId)
      .subscribe(contact => {
        this.existingEntities.push(contact);
        this.onEntityAdded.emit(contact);
        this.viewSearch = false;
      } );
  }

  excludeAlreadyAssociated(resultElements: CompanyOrContact[], filterArray: Contact[]) {
    const filteredArray = _.filter(resultElements, function(o) {
      const matchId = o.contactId;
      const compareList = _.map(filterArray, 'contactId' );
      const isMatch = _.indexOf( compareList,  matchId) > -1;
      return !isMatch;
    });
    return filteredArray;
  }
}
