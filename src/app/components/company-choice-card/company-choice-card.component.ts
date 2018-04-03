import {Component, OnInit, Input, EventEmitter, Output, Renderer} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import * as _ from 'lodash';

import { Company } from '../../classes/company';
import {EntityService} from '../../services/entity.service';
import {Observable} from 'rxjs/Observable';
import {CompanyOrContact} from '../../classes/common/company-or-contact';
import {CompanyOrContactService} from '../../services/company-or-contact.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-company-choice-card',
  templateUrl: './company-choice-card.component.html',
  styleUrls: ['./company-choice-card.component.css']
})
export class CompanyChoiceCardComponent implements OnInit {
  fontColor = 'black';
  myControl: FormControl = new FormControl();

  @Input() companyId: string;
  @Input() associationSuccessful = false;
  @Output() selectCompany = new EventEmitter<Company>();
  @Output() onCompanyChosen = new EventEmitter<string>();

  company: Company;
  results$: Observable<CompanyOrContact[]>;
  viewSearch = false;
  private searchTerms = new Subject<string>();

  constructor(
    private entityService: EntityService,
    public renderer: Renderer,
    private companyOrContactService: CompanyOrContactService,
  ) { }

  ngOnInit() {
    console.log(`dfm companyId ${this.companyId}`)
    if( this.companyId ) {
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
    this.entityService.getCompanyById(this.companyId)
      .subscribe(company => this.company = company);
  }

  onOptionSelected(selectedCoc): void {
    console.log( '--------------->>>>>>>>>>>>>>>> ', this.myControl );
    this.companyId = selectedCoc.companyId;
    this.loadCustomer();
    this.viewSearch = false;
    this.onCompanyChosen.emit( this.companyId );
  }

  onCompanySelected(): void {
    console.log('onCompanySelected / selectCompany');
    this.selectCompany.emit(this.company);
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

  resetCompany(): void {
    this.companyId = null;
    this.company = null;
    this.myControl = new FormControl();
    this.viewSearch = true;
  }

}
