import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { BaseViewComponent } from '../../components/base/base-view/base-view.component';
import { CompanyOrContact } from '../../classes/common/company-or-contact';

@Component({
  selector: 'app-dashboard-landing',
  templateUrl: './dashboard-landing.component.html',
  styleUrls: ['./dashboard-landing.component.css']
})
export class DashboardLandingComponent extends BaseViewComponent implements OnInit {

  showCommCard = false;
  refreshCommData = false;
  replyToComm: any;
  commCanceled = false;

  myControl: FormControl;
  results$: Observable<CompanyOrContact[]>;
  private searchTerms = new Subject<string>();
  public loadedCompany;  // TODO: Consider replacing with global from datastore
  public loadedContact;  // TODO: Consider replacing with global from datastore
  fatFilters: any;

  @Input() coc: string;
  @Input() id: string;

  loadedCompanyOrContact: CompanyOrContact;
  companyLoaded = false;
  contactLoaded = false;

  ngOnInit() {
    this.loadTeams();
    this.myControl = new FormControl();
    const coc = this.route.snapshot.paramMap.get('coc');
    const id = this.route.snapshot.paramMap.get('id');
    // Used the entity and id pulled off url
    this.loadPageFromParams(coc, id);
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.companyOrContactService.searchCompanyAndContact(term)),
    );
  }

  /* This will tell us if and when we can load the cards in the template. */
  searchEntityLoaded(): boolean {
    const entityDesired = this.companyLoaded || this.contactLoaded;
    const entityLoaded = this.loadedCompany || this.loadedContact;
    return entityDesired && entityLoaded;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  resetSearch(): void {
    this.loadedCompany = null;
    this.loadedContact = null;
    this.companyLoaded = false;
    this.contactLoaded = false;
    this.myControl = new FormControl();
    this.location.replaceState( `/dl` );
  }

  onOptionSelected(selectedCoc): void {
    this.loadedCompany = null;
    this.loadedContact = null;
    let id;
    this.loadedCompanyOrContact = selectedCoc;
    const loadedEnitty = this.loadedCompanyOrContact.entiyType;
    this.companyLoaded = this.loadedCompanyOrContact && ( loadedEnitty === 'company');
    this.contactLoaded = this.loadedCompanyOrContact && ( loadedEnitty === 'contact');
    if ( this.companyLoaded ) {
      id = this.loadedCompanyOrContact.companyId;
      this.location.replaceState( `/dl/company/${id}` );
    } else if ( this.contactLoaded ) {
      id = this.loadedCompanyOrContact.contactId;
      this.location.replaceState( `/dl/contact/${id}` );
    }
    // Emulate ngOnInit that pulls the entity and id off url
    this.loadPageFromParams(loadedEnitty, id);
  }

  loadPageFromParams(coc: string, id: string): void {
    this.companyLoaded = (coc === 'company');
    this.contactLoaded = (coc === 'contact');
    if (this.companyLoaded) {
      this.getCompaniesById(id);
    } else if (this.contactLoaded) {
      this.getContactsById(id);
    }
  }

  getContactsById = (id: string) =>this.entityService.getContactById( id ).subscribe( contact => this.loadedContact = contact );
  getCompaniesById = (id: string) => this.entityService.getCompanyById( id ).subscribe( company => this.loadedCompany = company );

  selectCompany = () => this.router.navigateByUrl( `/company/${this.loadedCompany.companyId}` );
  selectContact = () => this.router.navigateByUrl( `/contact/${this.loadedContact.contactId}` );

  updateFilters = (updatedFilters: any) => {
    this.fatFilters = updatedFilters;
  }

  commDataChanged(hasChanged: boolean) {
    console.log('the dashboard knows that data has changed::: ' + hasChanged);
    if (hasChanged) {
      this.refreshCommData = true;
      this.showCommCard = false;
    }
  }

  triggerReply(oa: any) {
    this.showCommCard = true;
    if ( oa ) {
      this.replyToComm = oa;
      this.refreshCommData = false;
    }
  }

  handleCommCancel(hasCanceled) {
    if ( hasCanceled ) {
      this.refreshCommData = false;
      this.showCommCard = false;
      this.replyToComm = null;
      this.commCanceled = true;
      this.commCanceled = false;
    }
  }
}
