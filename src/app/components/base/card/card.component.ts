import { Component, Input, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
// import * as colors from 'colors/safe';
import chalk from 'chalk';

import {ActionService} from '../../../services/action.service';
import {AttachmentService} from '../../../services/attachment.service';
import {CampaignService} from '../../../services/campaign.service';
import {CompanyService} from '../../../services/company.service';
import {CompanyOrContactService} from '../../../services/company-or-contact.service';
import {ContactService} from '../../../services/contact.service';
import {PhoneService} from '../../widgets/phone.service';
import {UrlService} from '../../widgets/url.service';
import {Observable} from 'rxjs/Observable';
import {TagService} from '../../../services/tag.service';
import {TaggingService} from '../../widgets/tagging.service';
import {DataStore} from '../../../classes/data-store';
import {AddressService} from '../../widgets/address.service';
import * as label from '../../labels';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges {

  public pristineElements: any = [];
  cardName = 'overwrite in the extending class';

  @Input() companyId: string;
  @Input() contactId: string;
  @Input() campaignId: string;
  @Input() actionId: string;

  suspendedEvent: Observable<any> = null;
  suspendedUndoEvent: Observable<any> = null;

  @Input() associationSuccessful = false;
  @Input() associationFailure = false;

  public headerColor = '#f0f3f5';
  public fontColor = 'black';
  public dirtyCardColor = 'deeppink';
  public mouseOverColor = 'pink';
  public readonly label = label;
  public cardIsDirty = false;

  public entities: any[];

  constructor (
    public companyOrContactService: CompanyOrContactService,
    public actionService: ActionService,
    public campaignService: CampaignService,
    public companyService: CompanyService,
    public contactService: ContactService,
    public phoneService: PhoneService,
    public urlService: UrlService,
    public renderer: Renderer2,
    public router: Router,
    public taggingService: TaggingService,
    public addressService: AddressService,
    public tagService: TagService,
    public dataStore: DataStore,
    public attachmentService: AttachmentService
  ) {}


  refreshSupportingData = () => console.log('function that should be overridden');

  ngOnChanges(changes: SimpleChanges) {

    // console.log(`----------------START::: ${this.cardName} -----------------`)
    // console.log(`${this.cardName} CHANGES:: `, changes);
    // console.log(`${this.cardName} associationSuccessful:: `, changes.associationSuccessful);
    // console.log(`----------------  END::: ${this.cardName} -----------------`)

    if ( changes.associationSuccessful && changes.associationSuccessful.currentValue ) {
      this.cardIsDirty = false;
      this.suspendedUndoEvent = null;
      this.refreshSupportingData();
      if ( this.suspendedEvent ) {
        this.suspendedEvent.subscribe( result => {
          console.log(chalk.cyan(':::: CARD HAS BEEN UPDATED AFTER ENTITY UPDATE IS COMPLETE::::'), result);
          this.suspendedEvent = null;
        });
      } else {
        console.log(chalk.cyan(':::: UPDATE SUCCESSFUL BUT NO FURTHER ACTION IS NEEDED ::::'));
      }
    }
    if ( changes.associationFailure && changes.associationFailure.currentValue ) {
      this.cardIsDirty = true;
      this.suspendedEvent = null;
      if ( this.suspendedUndoEvent ) {
        this.suspendedUndoEvent.subscribe( result => {
          console.log(chalk.cyan(':::: CARD HAS <<<< NOT >>>> BEEN UPDATED AFTER ENTITY UPDATE HAS BEEN ATTEMPTED::::'), result);
          this.suspendedUndoEvent = null;
        });
      } else {
        console.log(chalk.cyan(':::: UPDATE FAILED BUT NO MITIGATING ACTION IS NEEDED ::::'));
      }
    }
  }

  noUpdatesPending = () => ! (this.suspendedEvent || this.suspendedUndoEvent);

  isDirtyColor = () => {
    if ( this.cardIsDirty ) {
      return this.dirtyCardColor;
    } else {
      return '#f0f3f5';
    }
  };

  onConsideringEntity($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setStyle(target, 'color', this.mouseOverColor);
    this.renderer.setStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringEntity($event, thediv): void {
    const target = event.currentTarget || event.target || event.srcElement;
    this.renderer.setStyle(target, 'color', this.fontColor);
  }
}
