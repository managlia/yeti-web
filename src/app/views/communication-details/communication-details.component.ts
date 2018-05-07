import {Component, OnInit} from '@angular/core';

import {BaseViewComponent} from '../../components/base/base-view/base-view.component';
import {Announcement} from '../../classes/comms/announcement';

@Component({
  selector: 'app-communication-details',
  templateUrl: './communication-details.component.html',
  styleUrls: ['./communication-details.component.scss']
})
export class CommunicationDetailsComponent extends BaseViewComponent implements OnInit {

  refreshData = false;
  replyToComm: any;
  commCanceled = false;

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  dataChanged(hasChanged: boolean) {
    if (hasChanged) {
      this.refreshData = true;
    }
  }

  triggerReply(oa: any) {
    if ( oa ) {
      this.replyToComm = oa;
    }
  }

  handleCommCancel(hasCanceled) {
    if ( hasCanceled ) {
      this.refreshData = false;
      this.replyToComm = null;
      this.commCanceled = true;
      this.commCanceled = false;
    }
  }
}






