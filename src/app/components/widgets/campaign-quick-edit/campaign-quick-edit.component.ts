import {Component, Inject, OnInit, ViewChild, ComponentRef} from '@angular/core';
import { Router } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelect} from '@angular/material';
import * as _ from 'lodash';

import {Campaign} from '../../../classes/campaign';
import {CampaignClassificationType} from '../../../classes/types/campaign-classification-type';
import {ScopeType} from '../../../classes/types/scope-type';
import {CampaignService} from '../../../services/campaign.service';

@Component({
  selector: 'app-campaign-quick-edit',
  templateUrl: './campaign-quick-edit.component.html',
  styleUrls: ['./campaign-quick-edit.component.scss']
})
export class CampaignQuickEditComponent implements OnInit {

  @ViewChild('scopeSelect', {read: MatSelect}) scopeSelect: ComponentRef<MatSelect>;
  @ViewChild('typeSelect', {read: MatSelect}) typeSelect: ComponentRef<MatSelect>;

  localScopeTypeId: string = null;
  localClassificationTypeId: string = null;

  campaign: Campaign;
  originalData: any;
  shouldDelete = false;

  classificationTypes: CampaignClassificationType[];
  scopeTypes: ScopeType[];

  constructor(
    public dialogRef: MatDialogRef<CampaignQuickEditComponent>,
    public campaignService: CampaignService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.originalData = data;
    this.campaign = _.cloneDeep(data.campaign);
    this.classificationTypes = data.classificationTypes;
    this.scopeTypes = data.scopeTypes;
  }

  ngOnInit() {
    this.setLocalTypesFromCampaign();
  }

  setLocalTypesFromCampaign = () => {
    this.localScopeTypeId
      = this.campaign.scopeType ? this.campaign.scopeType.scopeTypeId : null;
    this.localClassificationTypeId
      = this.campaign.classificationType ? this.campaign.classificationType.campaignClassificationTypeId : null;
  };


  setCampaignTypesFromLocal = () => {
    this.campaign.scopeType = this.localScopeTypeId ?
      this.scopeTypes.filter(e => e.scopeTypeId === this.localScopeTypeId )[0] : null;

    this.campaign.classificationType = this.localClassificationTypeId ?
      this.classificationTypes.filter(e => e.campaignClassificationTypeId === this.localClassificationTypeId)[0] : null;

  };

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateClassificationType = (classificationType: CampaignClassificationType) => {
    this.campaign.classificationType = classificationType;
  };

  closeAndUndo(event): void {
    this.dialogRef.close();
  }

  closeAndKeep(event): void {
    console.log('should delete ???? ' , this.shouldDelete);
    if (this.shouldDelete) {
      this.deleteCampaign();
    } else {
      this.updateCampaignAndClose();
    }
  }

  updateCampaignAndClose() {
    this.setCampaignTypesFromLocal();
    this.campaignService.updateCampaign(this.campaign).subscribe(result => {
        const foundIndex = this.originalData.dataSource.data.findIndex(e => e === this.originalData.campaign);
        this.originalData.dataSource.data.splice(foundIndex, 1, this.campaign);
        this.originalData.dataSource.data = this.originalData.dataSource.data;
        this.dialogRef.close();
      },
      error => {
        console.log('error', error);
        // TODO: Show error alert in modal
      });
  }

  deleteCampaign( ) {
    console.log('DELETING ' , this.originalData.campaign.campaignId);
    this.campaignService.deleteCampaign(this.originalData.campaign.campaignId)
      .subscribe(result => {
          console.log( 'before', this.originalData.dataSource.data.length );
          this.originalData.dataSource.data = this.originalData.dataSource.data.filter(e => e !== this.originalData.campaign );
          this.originalData.dataSource = this.originalData.dataSource;
          console.log( 'after', this.originalData.dataSource.data.length );
          this.dialogRef.close();
        },
        error => {
          console.log('error', error);
          // TODO: Show delete error alert in modal
        });
  }

  routeToCampaign(): void {
    this.router.navigateByUrl( `/campaign/${this.campaign.campaignId}` );
    this.dialogRef.close();
  }

}
