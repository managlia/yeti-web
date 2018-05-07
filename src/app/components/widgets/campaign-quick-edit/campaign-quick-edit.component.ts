import {Component, Inject, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';

import {Campaign} from '../../../classes/campaign';
import {CampaignService} from '../../../services/campaign.service';
import {DataStore} from '../../../classes/data-store';

@Component({
  selector: 'app-campaign-quick-edit',
  templateUrl: './campaign-quick-edit.component.html',
  styleUrls: ['./campaign-quick-edit.component.scss']
})
export class CampaignQuickEditComponent implements OnInit {

  resourceId = DataStore.userId;
  quickFormGroup: FormGroup;

  campaign: Campaign;

  constructor(
    public dialogRef: MatDialogRef<CampaignQuickEditComponent>,
    public campaignService: CampaignService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.campaign = data.campaign;
  }

  ngOnInit() {
    this.quickFormGroup = new FormGroup( {});
    this.createForm();
  }

  createForm = () => {
    this.quickFormGroup.addControl( 'campaignName', new FormControl(this.campaign.name, [Validators.required]) );
    this.quickFormGroup.addControl( 'campaignDescription', new FormControl(this.campaign.description, [Validators.required]), );
    this.quickFormGroup.addControl( 'activeCampaign', new FormControl(this.campaign.active) );
    this.quickFormGroup.addControl( 'actualCompletionDate', new FormControl(this.campaign.actualCompletionDate, [Validators.required]) );
    this.quickFormGroup.addControl( 'shouldDelete', new FormControl(false ) );
    this.disableCompletionDate();
  };

  get campaignName() { return this.quickFormGroup.get('campaignName'); }
  get campaignDescription() { return this.quickFormGroup.get('campaignDescription'); }
  get activeCampaign() { return this.quickFormGroup.get('activeCampaign'); }
  get actualCompletionDate() { return this.quickFormGroup.get('actualCompletionDate'); }
  get shouldDelete() { return this.quickFormGroup.get('shouldDelete'); }

  copyFormToCampaign = () => {
    this.campaign.name = this.campaignName.value;
    this.campaign.description = this.campaignDescription.value;
    this.campaign.active = this.activeCampaign.value;
    if ( this.actualCompletionDate.value ) {
      const completeDate = new Date(this.actualCompletionDate.value);
      this.campaign.actualCompletionDate =
        moment.tz( completeDate, 'Etc/UTC').format('YYYY-MM-DD HH:mm');
    }
  };

  disableCompletionDate = () => {
    const disableCompletionDate = this.activeCampaign.value;
    if ( disableCompletionDate ) {
      this.actualCompletionDate.setValue(null );
      this.actualCompletionDate.disable();
    } else {
      this.actualCompletionDate.enable();
    }
  };

  reset = () => {
    this.dialogRef.close();
  };

  closeAndKeep(event): void {
    console.log( 'should delete:::: ' + this.shouldDelete.value );
    if ( this.shouldDelete.value ) {
      this.campaignService.deleteCampaign(this.campaign.campaignId).subscribe(feedback => {
        console.log('campaign deleted. We could close now');
        this.dialogRef.close('successfully deleted');
      });
    } else {
      this.copyFormToCampaign();
      this.campaignService.updateCampaign(this.campaign).subscribe(feedback => {
        console.log('campaign updated. We could close now');
        this.dialogRef.close('successfully updated');
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close('no change');
  }

  routeToCampaign(): void {
    this.router.navigateByUrl( `/campaign/${this.campaign.campaignId}` );
    this.dialogRef.close();
  }

  unreadyToSave(): boolean {
    return !(this.quickFormGroup.dirty && this.quickFormGroup.valid);
  }


}
