import {Component, OnInit, Renderer2} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {EntityService} from '../../services/entity.service';
import {CompanyOrContactService} from '../../services/company-or-contact.service';
import * as label from '../view-labels';

@Component({
  selector: 'app-view-base',
  templateUrl: './view-base.component.html',
  styleUrls: ['./view-base.component.scss']
})
export class ViewBaseComponent implements OnInit {
  bgColor = 'black';
  highlightColor = 'rebeccapurple';
  public readonly label = label;

  constructor(
    public route: ActivatedRoute,
    public companyOrContactService: CompanyOrContactService,
    public location: Location,
    public router: Router,
    public renderer: Renderer2,
    public entityService: EntityService
  ) {
  }

  ngOnInit() {
  }

  onConsideringEntity($event, thediv): void {
    const target = event.srcElement;
    this.renderer.setStyle(target, 'color', this.highlightColor);
    this.renderer.setStyle(target, 'cursor', 'pointer');
  }

  onUnconsideringEntity($event, thediv): void {
    const target = event.srcElement;
    this.renderer.setStyle(target, 'color', this.bgColor);
  }

}
