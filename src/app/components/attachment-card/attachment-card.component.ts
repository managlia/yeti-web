import { Component, OnInit, Input, Renderer } from '@angular/core';
import { Router } from '@angular/router';

import { Attachment } from '../../classes/common/attachment';
import { AttachmentService } from '../widgets/attachment.service';

@Component({
  selector: 'app-attachment-card',
  templateUrl: './attachment-card.component.html',
  styleUrls: ['./attachment-card.component.css']
})
export class AttachmentCardComponent implements OnInit {
  @Input() attachments: Attachment[];
  fontColor = 'black';

  constructor(
    private router: Router,
    public renderer: Renderer,
    private attachmentService: AttachmentService
  ) { }

  ngOnInit() {
  }

  onAttchmentOver($event, thediv): void {
    const target = event.target || event.srcElement || event.currentTarget;
    this.renderer.setElementStyle(target, 'color', 'rebeccapurple');
    this.renderer.setElementStyle(target, 'cursor', 'pointer');
  }

  onAttachmentOut($event, thediv): void {
    const target = event.target || event.srcElement || event.currentTarget;
    this.renderer.setElementStyle(target, 'color', this.fontColor);
  }

  onSelectAttachment($event, attachmentId): void {
    console.log(`clicked on ${attachmentId}`);
  }

  openAttachmentDialog(): void {
    this.attachmentService.openDialog(this.attachments)
      .subscribe( result => console.log('update complete') );
  }

}
