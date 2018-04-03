import { Component, OnInit, Input } from '@angular/core';

import { UrlType } from '../../classes/types/url-type';
import { Url } from '../../classes/common/url';
import { UrlService } from '../widgets/url.service';

@Component({
  selector: 'app-links-card',
  templateUrl: './links-card.component.html',
  styleUrls: ['./links-card.component.css']
})

export class LinksCardComponent implements OnInit {
  @Input() urls: Url[];
  @Input() urlTypes: UrlType[];
  constructor(
    private urlService: UrlService
  ) { }

  ngOnInit() {
  }

  openUrlDialog(): void {
    this.urlService.openDialog(this.urls, this.urlTypes)
      .subscribe( result => console.log('update complete') );
  }

}
