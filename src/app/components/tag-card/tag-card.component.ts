import {Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';

import { Tag } from '../../classes/common/tag';
import {CardComponent} from '../base/card/card.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-tag-card',
  templateUrl: './tag-card.component.html',
  styleUrls: ['./tag-card.component.css']
})
export class TagCardComponent extends CardComponent implements OnInit, OnChanges {

  @Output() tagsUpdated = new EventEmitter<Tag[]>();
  @Input() tags: Tag[];
  allTagList: Tag[];

  ngOnInit() {
    this.cardName = 'tag';
    this.refreshSupportingData();
    this.storePristineElements();
    this.tags = _.sortBy(this.tags, ['name']);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if ( changes.tags && this.pristineElements ) {
      if ( _.differenceWith(changes.tags.currentValue, this.pristineElements, _.isEqual).length === 0 ) {
        // exclusively for reset button on the parent
        this.cardIsDirty = false;
      }
    }
  }

  refreshSupportingData = () => this.tagService.getTagList().subscribe(allTagList => this.allTagList = allTagList);

  storePristineElements = () => this.pristineElements = _.cloneDeep(this.tags);

  openTagsDialog(): void {
    this.taggingService.openDialog( { tags: this.tags, wholeTagList: this.allTagList} )
      .subscribe( result => {
          if (result) {
            // result = result.map( x => x.toLowerCase() );
            this.cardIsDirty = true;
            const foundTags = this.allTagList.filter( e => result.includes(e.name) );
            const foundNames = foundTags.map( e => e.name );
            const filteredArray = result.filter( (e) => !foundNames.includes(e));
            const newTags = filteredArray.map( (e) =>  new Tag(this.resourceId, e, e) );

            console.log('foundTags ---------->>>>> ', foundTags);
            console.log('newTags   ---------->>>>> ', newTags);

            foundTags.push(...newTags);

            this.tags = foundTags;
            console.log('::newTags ---------->>>>> ', this.tags);
            this.cardIsDirty = true;
            this.suspendedUndoEvent  = new Observable<any>(observer => {
              this.tags = _.cloneDeep(this.storePristineElements);
              observer.next('undone');
              observer.complete();
              return {unsubscribe() {}};
            });
            this.tagsUpdated.emit(this.tags);
          }
        });
  }

}
