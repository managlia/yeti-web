import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { UrlType } from '../../classes/types/url-type';
import { Url } from '../../classes/common/url';
import { UrlService } from '../widgets/url.service';
import {CardComponent} from '../base/card/card.component';

@Component({
  selector: 'app-links-card',
  templateUrl: './links-card.component.html',
  styleUrls: ['./links-card.component.css']
})

export class LinksCardComponent extends CardComponent implements OnInit {

  @Output() linksUpdated = new EventEmitter<Url[]>();

  @Input() urls: Url[];
  @Input() urlTypes: UrlType[];

  ngOnInit() {
  }

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
