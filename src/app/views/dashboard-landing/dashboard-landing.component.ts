import {Component, OnInit, Input, Renderer} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {FormControl} from '@angular/forms';

import { EntityService } from '../../services/entity.service';
import { CompanyOrContactService } from '../../services/company-or-contact.service';
import {CompanyOrContact} from '../../classes/common/company-or-contact';
import {Company} from '../../classes/company';
import {Contact} from '../../classes/contact';

@Component({
  selector: 'app-dashboard-landing',
  templateUrl: './dashboard-landing.component.html',
  styleUrls: ['./dashboard-landing.component.css']
})
export class DashboardLandingComponent implements OnInit {
  bgColor = 'black';
  myControl: FormControl = new FormControl();
  results$: Observable<CompanyOrContact[]>;
  private searchTerms = new Subject<string>();
  public loadedCompany;  // need to replace
  public loadedContact;  // need to replace

  @Input() coc: string;
  @Input() id: string;

  loadedCompanyOrContact: CompanyOrContact;
  companyLoaded: boolean = this.loadedCompanyOrContact && (this.loadedCompanyOrContact.entiyType === 'company');
  contactLoaded: boolean = this.loadedCompanyOrContact && (this.loadedCompanyOrContact.entiyType === 'contact');

  constructor(
    private route: ActivatedRoute,
    private companyOrContactService: CompanyOrContactService,
    private router: Router,
    public renderer: Renderer,
    private entityService: EntityService
  ) {
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  resetEntities(): void {
    this.loadedCompany = null;  // need to replace
    this.loadedContact = null;  // need to replace
  }

  onOptionSelected(selectedCoc): void {
    this.resetEntities();
    let id;
    this.loadedCompanyOrContact = selectedCoc;
    const loadedEnitty = this.loadedCompanyOrContact.entiyType;
    this.companyLoaded =
      this.loadedCompanyOrContact && ( loadedEnitty === 'company');
    this.contactLoaded =
      this.loadedCompanyOrContact && ( loadedEnitty === 'contact');
    if ( this.companyLoaded ) {
      id = this.loadedCompanyOrContact.companyId;
      this.router.navigateByUrl( `/dl/company/${id}` );
    } else if ( this.contactLoaded ) {
      id = this.loadedCompanyOrContact.contactId;
      this.router.navigateByUrl( `/dl/contact/${id}` );
    }
    this.loadPageFromParams(loadedEnitty, id);
    this.myControl = new FormControl();
  }

  loadPageFromParams(coc: string, id: string): void {
    this.companyLoaded = (coc === 'company');
    this.contactLoaded = (coc === 'contact');
    if (this.companyLoaded) {
      // this.loadedContact = new Contact();
      this.getCompaniesById(id);
    } else if (this.contactLoaded) {
      // this.loadedCompany = new Company();
      this.getContactsById(id);
    }
  }

  getContactsById(id: string): void {
    this.entityService.getContactById( id )
      .subscribe( contact => this.loadedContact = contact );
  }

  getCompaniesById(id: string): void {
    this.entityService.getCompanyById( id )
        .subscribe( company => this.loadedCompany = company );
  }

  ngOnInit() {
    const coc = this.route.snapshot.paramMap.get('coc');
    const id = this.route.snapshot.paramMap.get('id');
    this.loadPageFromParams(coc, id);
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.companyOrContactService.searchCompanyAndContact(term)),
    );
  }

  onConsideringEntity($event, thediv): void {
    const target = event.srcElement;
    this.renderer.setElementStyle(target, 'color', 'rebeccapurple');
    this.renderer.setElementStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringEntity($event, thediv): void {
    const target = event.srcElement;
    this.renderer.setElementStyle(target, 'color', this.bgColor);
  }

  selectCompany(): void {
    console.log( `selected company ${this.loadedCompany.companyId}`);
    this.router.navigateByUrl( `/company/${this.loadedCompany.companyId}` );
  }

  selectContact(): void {
    console.log( `selected contact ${this.loadedContact.contactId}`);
    this.router.navigateByUrl( `/contact/${this.loadedContact.contactId}` );
  }

}
