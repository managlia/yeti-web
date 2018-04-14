import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';

import { UrlType } from '../../classes/types/url-type';
import { Url } from '../../classes/common/url';
import {CardComponent} from '../base/card/card.component';

@Component({
  selector: 'app-links-card',
  templateUrl: './links-card.component.html',
  styleUrls: ['./links-card.component.css']
})

export class LinksCardComponent extends CardComponent implements OnInit, OnChanges {

  @Output() linksUpdated = new EventEmitter<Url[]>();

  @Input() urls: Url[];
  @Input() urlTypes: UrlType[];

  ngOnInit() {
    this.cardName = 'links';
    this.storePristineElements();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if ( changes.urls && this.pristineElements ) {
      if ( _.differenceWith(changes.urls.currentValue, this.pristineElements, _.isEqual).length === 0 ) {
        // exclusively for reset button on the parent
        this.cardIsDirty = false;
      }
    }
  }

  storePristineElements = () => this.pristineElements = _.cloneDeep(this.urls);

  openUrl = (url: string) => {
    window.open( url, '_blank', url);
  };

  openUrlDialog(): void {
    this.urlService.openDialog(this.urls, this.urlTypes)
      .subscribe( result => {
        if (result) {
          this.cardIsDirty = true;
          this.urls = result;
          this.linksUpdated.emit(result);
        }
      });
  }
}
