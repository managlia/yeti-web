import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import {Attachment} from '../common/attachment';
import * as tc from './text-constants';

@Pipe({
  name: 'attachmentSummary',
  pure: false
})
export class AttachmentSummaryPipe implements PipeTransform {

  transform = (attachment: Attachment) => {
    let formattedString = `${tc.attachmentText.name}${tc.colon}${tc.space}${attachment.fileName}${tc.htmlTags.break}`;
    formattedString += `${tc.attachmentText.storeDate}${tc.colon}${tc.space}${moment(attachment.storageDate).format('lll')}${tc.htmlTags.break}`;
    return formattedString;
  }
}
