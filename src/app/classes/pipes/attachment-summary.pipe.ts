import { Pipe, PipeTransform } from '@angular/core';
import {Attachment} from '../common/attachment';

@Pipe({
  name: 'attachmentSummary',
  pure: false
})
export class AttachmentSummaryPipe implements PipeTransform {

  transform(attachment: Attachment): string {
    let formattedString = 'Name: ' + attachment.name + '<br>';
    formattedString += 'Store Date: ' + attachment.createDate + '<br>';
    return formattedString;
  }

}
