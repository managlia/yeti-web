import { Component, OnInit, Input } from '@angular/core';
import { Tag } from '../../classes/common/tag';
import { TagService } from '../widgets/tag.service';

@Component({
  selector: 'app-tag-card',
  templateUrl: './tag-card.component.html',
  styleUrls: ['./tag-card.component.css']
})
export class TagCardComponent implements OnInit {

  @Input() tags: Tag[];

  constructor(
    private tagService: TagService
  ) { }

  ngOnInit() {
  }

  openTagsDialog(): void {
    console.log('opening tags dialog');
    this.tagService.openDialog(this.tags)
      .subscribe(result => this.tags = result);
  }

}
