import { Component, Input, Renderer2 } from '@angular/core';
import {Router} from '@angular/router';
import {ActionService} from '../../../services/action.service';
import * as label from '../../labels';
import {CampaignService} from '../../../services/campaign.service';
import {CompanyService} from '../../../services/company.service';
import {CompanyOrContactService} from '../../../services/company-or-contact.service';
import {ContactService} from '../../../services/contact.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() companyId: string;
  @Input() contactId: string;
  @Input() campaignId: string;
  @Input() actionId: string;

  @Input() associationSuccessful = false;
  @Input() associationFailure = false;

  public fontColor = 'black';
  public mouseOverColor = 'pink';
  public readonly label = label;

  public entities: any[];

  constructor (
    public companyOrContactService: CompanyOrContactService,
    public actionService: ActionService,
    public campaignService: CampaignService,
    public companyService: CompanyService,
    public contactService: ContactService,
    public renderer: Renderer2,
    public router: Router
  ) {}

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
