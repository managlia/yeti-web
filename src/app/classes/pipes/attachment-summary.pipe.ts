import { Pipe, PipeTransform } from '@angular/core';

import {Attachment} from '../common/attachment';
import * as tc from './text-constants';

@Pipe({
  name: 'attachmentSummary',
  pure: false
})
export class AttachmentSummaryPipe implements PipeTransform {

  transform = (attachment: Attachment) => {
    let formattedString = `${tc.attachmentText.name}${tc.colon}${tc.space}${attachment.name}${tc.htmlTags.break}`;
    formattedString += `${tc.attachmentText.storeDate}${tc.colon}${tc.space}${attachment.createDate}${tc.htmlTags.break}`;
    return formattedString;
  }
}


