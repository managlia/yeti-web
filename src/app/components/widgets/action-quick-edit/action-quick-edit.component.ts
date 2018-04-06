import {Component, Inject, OnInit, ViewChild, ComponentRef} from '@angular/core';
import { Router } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelect} from '@angular/material';
import * as _ from 'lodash';

import {Action} from '../../../classes/action';
import {ActionClassificationType} from '../../../classes/types/action-classification-type';
import {ActionClassificationOtherType} from '../../../classes/types/action-classification-other-type';
import {ScopeType} from '../../../classes/types/scope-type';
import {ActionService} from '../../../services/action.service';

@Component({
  selector: 'app-action-quick-edit',
  templateUrl: './action-quick-edit.component.html',
  styleUrls: ['./action-quick-edit.component.scss']
})
export class ActionQuickEditComponent implements OnInit {

  @ViewChild('scopeSelect', {read: MatSelect}) scopeSelect: ComponentRef<MatSelect>;
  @ViewChild('typeSelect', {read: MatSelect}) typeSelect: ComponentRef<MatSelect>;
  @ViewChild('otherSelect', {read: MatSelect}) otherSelect: ComponentRef<MatSelect>;

  localScopeTypeId: string = null;
  localClassificationTypeId: string = null;
  localClassificationOtherTypeId: string = null;

  action: Action;
  originalData: any;
  shouldDelete = false;
  isDisabledOtherActive = true;

  classificationTypes: ActionClassificationType[];
  classificationOtherTypes: ActionClassificationOtherType[];
  scopeTypes: ScopeType[];

  constructor(
    public dialogRef: MatDialogRef<ActionQuickEditComponent>,
    public actionService: ActionService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.originalData = data;
    this.action = _.cloneDeep(data.action);
    this.classificationTypes = data.classificationTypes;
    this.classificationOtherTypes = data.classificationOtherTypes;
    this.scopeTypes = data.scopeTypes;
  }

  ngOnInit() {
    this.setLocalTypesFromAction();
  }

  setLocalTypesFromAction = () => {
    this.localScopeTypeId
      = this.action.scopeType ? this.action.scopeType.scopeTypeId : null;
    this.localClassificationTypeId
      = this.action.classificationType ? this.action.classificationType.actionClassificationTypeId : null;
    this.localClassificationOtherTypeId
      = this.action.classificationOtherType ? this.action.classificationOtherType.actionClassificationOtherTypeId : null;
    this.updateTheOther(this.localClassificationTypeId);
  };


  setActionTypesFromLocal = () => {
    if ( this.localClassificationTypeId !== 'OT' ) {
      this.localClassificationOtherTypeId = null;
    }
    this.action.scopeType = this.localScopeTypeId ?
      this.scopeTypes.filter(e => e.scopeTypeId === this.localScopeTypeId )[0] : null;

    this.action.classificationType = this.localClassificationTypeId ?
      this.classificationTypes.filter(e => e.actionClassificationTypeId === this.localClassificationTypeId)[0] : null;

    this.action.classificationOtherType = this.localClassificationOtherTypeId ?
      this.classificationOtherTypes.filter
      (e => e.actionClassificationOtherTypeId as string === this.localClassificationOtherTypeId as string)[0] : null;
  };

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateTheOther = (classificationTypeId: string) => this.isDisabledOtherActive = (classificationTypeId !== 'OT');

  updateClassificationType = (classificationType: ActionClassificationType) => {
    this.action.classificationType = classificationType;
  };

  closeAndUndo(event): void {
    this.dialogRef.close();
  }

  closeAndKeep(event): void {
    console.log('should delete ???? ' , this.shouldDelete);
    if (this.shouldDelete) {
      this.deleteAction();
    } else {
      this.updateActionAndClose();
    }
  }

  updateActionAndClose() {
    this.setActionTypesFromLocal();
    this.actionService.updateAction(this.action).subscribe(result => {
        const foundIndex = this.originalData.dataSource.data.findIndex(e => e === this.originalData.action);
        this.originalData.dataSource.data.splice(foundIndex, 1, this.action);
        this.originalData.dataSource.data = this.originalData.dataSource.data;
        this.dialogRef.close();
      },
      error => {
        console.log('error', error);
        // TODO: Show error alert in modal
      });
  }

  deleteAction( ) {
    console.log('DELETING ' , this.originalData.action.actionId);
    this.actionService.deleteAction(this.originalData.action.actionId)
      .subscribe(result => {
          console.log( 'before', this.originalData.dataSource.data.length );
          this.originalData.dataSource.data = this.originalData.dataSource.data.filter(e => e !== this.originalData.action );
          this.originalData.dataSource = this.originalData.dataSource;
          console.log( 'after', this.originalData.dataSource.data.length );
          this.dialogRef.close();
        },
        error => {
          console.log('error', error);
          // TODO: Show delete error alert in modal
        });
  }

  routeToAction(): void {
    this.router.navigateByUrl( `/action/${this.action.actionId}` );
    this.dialogRef.close();
  }

}
