import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk/table';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { ReactiveFormsModule } from '@angular/forms';  // <-- #1 import module
import { NgxElectronModule } from 'ngx-electron';

// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent
]

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
} from './components';


// yeti dashboard
import { DashboardLandingComponent } from './views/dashboard-landing/dashboard-landing.component';

import { ActionListCardComponent } from './components/action-list-card/action-list-card.component';
import { CampaignListCardComponent } from './components/campaign-list-card/campaign-list-card.component';

// yeti company
import { CompanyDetailsComponent } from './views/company-details/company-details.component';

import { ActionCardComponent } from './components/action-card/action-card.component';
import { CampaignCardComponent } from './components/campaign-card/campaign-card.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';

import { AddressCardComponent } from './components/address-card/address-card.component';
import { AttachmentCardComponent } from './components/attachment-card/attachment-card.component';
import { LinksCardComponent } from './components/links-card/links-card.component';
import { PhoneCardComponent } from './components/phone-card/phone-card.component';
import { ProspectCardComponent } from './components/prospect-card/prospect-card.component';
import { TagCardComponent } from './components/tag-card/tag-card.component';

// yeti contact
import { ContactDetailsComponent } from './views/contact-details/contact-details.component';
import { CompanyChoiceCardComponent } from './components/company-choice-card/company-choice-card.component';

// yeti campaign
import { CampaignDetailsComponent } from './views/campaign-details/campaign-details.component';

import { CompanyAdderComponent } from './components/widgets/company-adder/company-adder.component';
import { CompanyCardComponent } from './components/company-card/company-card.component';

// yeti campaign
import { ActionDetailsComponent } from './views/action-details/action-details.component';
import { EmailDetailsComponent } from './views/email-details/email-details.component';

import { AddressDetailsComponent } from './components/widgets/address-details/address-details.component';
import { AttachmentDetailsComponent } from './components/widgets/attachment-details/attachment-details.component';
import { DateTimeDetailsComponent } from './components/widgets/date-time-details/date-time-details.component';
import { TagDetailsComponent } from './components/widgets/tag-details/tag-details.component';
import { UrlDetailsComponent } from './components/widgets/url-details/url-details.component';

import { ActionAdderComponent } from './components/widgets/action-adder/action-adder.component';
import { CampaignAdderComponent } from './components/widgets/campaign-adder/campaign-adder.component';
import { ContactAdderComponent } from './components/widgets/contact-adder/contact-adder.component';
import { SimpleDatePickerComponent } from './components/widgets/simple-date-picker/simple-date-picker.component';

import { AttachmentSummaryPipe } from './classes/pipes/attachment-summary.pipe';
import { CompanySummaryPipe } from './classes/pipes/company-summary.pipe';
import { ContactSummaryPipe } from './classes/pipes/contact-summary.pipe';
import { FormatAddressPipe } from './classes/pipes/format-address.pipe';
import { MapToCommonIdPipe } from './classes/pipes/map-to-common-id.pipe';

import { DataStore } from './classes/data-store';

import { AddressService } from './components/widgets/address.service';
import { AttachmentService } from './components/widgets/attachment.service';
import { DateTimeService } from './components/widgets/date-time.service';
import { TagService } from './components/widgets/tag.service';
import { UrlService } from './components/widgets/url.service';
import { PhoneService } from './components/widgets/phone.service';
import { ActionQuickEditService } from './components/widgets/action-quick-edit.service';
import { CampaignQuickEditService } from './components/widgets/campaign-quick-edit.service';

import { ActionClassificationOtherTypeService } from './services/action-classification-other-type.service';
import { ActionClassificationTypeService } from './services/action-classification-type.service';
import { ActionContactService } from './services/action-contact.service';
import { ActionService } from './services/action.service';
import { EmailService } from './services/email.service';
import { CampaignClassificationTypeService } from './services/campaign-classification-type.service';
import { CampaignOrActionService } from './services/campaign-or-action.service';
import { CampaignService } from './services/campaign.service';
import { CompanyAddressClassificationTypeService } from './services/company-address-classification-type.service';
import { CompanyClassificationTypeService } from './services/company-classification-type.service';
import { CompanyOrContactService } from './services/company-or-contact.service';
import { CompanyService } from './services/company.service';
import { ContactAddressClassificationTypeService } from './services/contact-address-classification-type.service';
import { ContactClassificationTypeService } from './services/contact-classification-type.service';
import { ContactService } from './services/contact.service';
import { ContactTitleTypeService } from './services/contact-title-type.service';

import { CompanyUrlService } from './services/company-url.service';
import { CompanyUrlTypeService } from './services/company-url-type.service';
import { ContactUrlService } from './services/contact-url.service';
import { ContactUrlTypeService } from './services/contact-url-type.service';

import { CompanyPhoneService } from './services/company-phone.service';
import { CompanyPhoneTypeService } from './services/company-phone-type.service';
import { ContactPhoneService } from './services/contact-phone.service';
import { ContactPhoneTypeService } from './services/contact-phone-type.service';

import { DataService } from './services/data.service';
import { EntityService } from './services/entity.service';
import { ExceptionService } from './services/exception.service';
import { LoggerService } from './services/logger.service';
import { ScopeTypeService } from './services/scope-type.service';

import { ElectronService } from 'ngx-electron';


const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
]

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ActiveConversionPipe } from './classes/pipes/active-conversion.pipe';
import { ContactEmailCardComponent } from './components/contact-email-card/contact-email-card.component';
import { ContactEmailSummaryPipe } from './classes/pipes/contact-email-summary.pipe';
import { MoreSimpleDatePickerComponent } from './components/widgets/more-simple-date-picker/more-simple-date-picker.component';
import { CardComponent } from './components/base/card/card.component';
import { ActionQuickEditComponent } from './components/widgets/action-quick-edit/action-quick-edit.component';
import { CampaignQuickEditComponent } from './components/widgets/campaign-quick-edit/campaign-quick-edit.component';
import { ViewBaseComponent } from './views/view-base/view-base.component';
import { PhoneDetailsComponent } from './components/widgets/phone-details/phone-details.component';

@NgModule({
  imports: [
    AngularMultiSelectModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    CdkTableModule,
    FileUploadModule,
    FormsModule,
    HttpClientModule,
    NgPipesModule,
    ReactiveFormsModule,
    NgxElectronModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: [
    AddressDetailsComponent,
    AttachmentDetailsComponent,
    TagDetailsComponent,
    DateTimeDetailsComponent,
    UrlDetailsComponent,
    PhoneDetailsComponent,

    AttachmentSummaryPipe,
    CompanySummaryPipe,
    ContactSummaryPipe,
    FormatAddressPipe,
    MapToCommonIdPipe,
    AppComponent,

    DashboardLandingComponent,
    ActionListCardComponent,
    CampaignListCardComponent,

    CompanyDetailsComponent,
    ActionCardComponent,
    CampaignCardComponent,
    ContactCardComponent,
    ActionAdderComponent,
    CampaignAdderComponent,
    ContactAdderComponent,

    ContactDetailsComponent,
    CompanyChoiceCardComponent,

    CampaignDetailsComponent,
    CompanyAdderComponent,
    CompanyCardComponent,

    ActionDetailsComponent,
    EmailDetailsComponent,

    AddressCardComponent,
    AttachmentCardComponent,
    LinksCardComponent,
    PhoneCardComponent,
    ProspectCardComponent,
    TagCardComponent,
    SimpleDatePickerComponent,

    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    ActiveConversionPipe,
    ContactEmailCardComponent,
    ContactEmailSummaryPipe,
    MoreSimpleDatePickerComponent,
    CardComponent,
    ActionQuickEditComponent,
    CampaignQuickEditComponent,
    ViewBaseComponent,
    PhoneDetailsComponent,
  ],
  providers: [
    AddressService, AttachmentService, DateTimeService, TagService, UrlService, PhoneService,
    ActionQuickEditService, CampaignQuickEditService,
    ActionService, EmailService, CampaignService, ContactService, CompanyService,
    ExceptionService, DataService, LoggerService, ActionClassificationTypeService,
    ActionClassificationOtherTypeService, CompanyUrlService, CompanyUrlTypeService, ContactUrlService, ContactUrlTypeService,
    CompanyPhoneService, CompanyPhoneTypeService, ContactPhoneService, ContactPhoneTypeService,
    CompanyClassificationTypeService, CompanyAddressClassificationTypeService,
    ContactAddressClassificationTypeService, ContactClassificationTypeService, ContactTitleTypeService,
    CampaignClassificationTypeService, ScopeTypeService, EntityService, CompanyOrContactService,
    CampaignOrActionService, ActionContactService, DataStore, ElectronService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    }],
  bootstrap: [ AppComponent ],
  entryComponents: [AddressDetailsComponent, AttachmentDetailsComponent, TagDetailsComponent, DateTimeDetailsComponent,
                  ActionQuickEditComponent, CampaignQuickEditComponent, UrlDetailsComponent, PhoneDetailsComponent]
})
export class AppModule { }
