import {Component, OnInit, Input, OnChanges, EventEmitter, Output, SimpleChanges} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {Observable } from 'rxjs/Observable';
import { CompanyOrContact } from '../../../classes/common/company-or-contact';
import { Contact } from '../../../classes/contact';
import { CompanyOrContactService } from '../../../services/company-or-contact.service';
import { ContactService } from '../../../services/contact.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-contact-adder',
  templateUrl: './contact-adder.component.html',
  styleUrls: ['./contact-adder.component.css']
})
export class ContactAdderComponent implements OnInit, OnChanges {
  myControl: FormControl = new FormControl();

  @Input() existingContacts: Contact[];
  @Output() onContactAdded = new EventEmitter<Contact>();

  results$: Observable<CompanyOrContact[]>;
  results: CompanyOrContact[];
  viewSearch = false;

  private searchTerms = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private companyOrContactService: CompanyOrContactService,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.companyOrContactService.searchContact(term) ),
    );
    this.results$
      .subscribe(results => this.results = this.excludeAlreadyAssociated(results, this.existingContacts) );
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.onContactAdded.emit(this.existingContacts);
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  addNewContact(): void {
    this.myControl = new FormControl();
    this.viewSearch = true;
  }

  onOptionSelected(selectedCoc): void {
    const contactId = selectedCoc.contactId;
    console.log( `gotta get the contact id for ${contactId}`);
    this.contactService.getContact(contactId)
      .subscribe(contact => {
        this.existingContacts.push(contact);
        console.log('onOptionSelected / onContactAdded');
        this.onContactAdded.emit(contact);
      } );
    this.viewSearch = false;
  }

  excludeAlreadyAssociated(resultElements: CompanyOrContact[], filterArray: Contact[]) {
    console.log( 'result elements', resultElements  );
    console.log( 'filter array', filterArray  );

    const filteredArray = _.filter(resultElements, function(o) {
      const matchId = o.contactId;
      const compareList = _.map(filterArray, 'contactId' );
      const isMatch = _.indexOf( compareList,  matchId) > -1;
      return !isMatch;
    });
    return filteredArray;
  }

}
