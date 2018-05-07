import {Component, Inject, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';

import {Action} from '../../../classes/action';
import {ActionService} from '../../../services/action.service';
import {DataStore} from '../../../classes/data-store';
import {SimpleDateTimePickerComponent} from '../simple-date-time-picker/simple-date-time-picker.component';

@Component({
  selector: 'app-action-quick-edit',
  templateUrl: './action-quick-edit.component.html',
  styleUrls: ['./action-quick-edit.component.scss']
})
export class ActionQuickEditComponent implements OnInit, AfterViewInit {

  @ViewChild(SimpleDateTimePickerComponent) simpleDateTimePicker: SimpleDateTimePickerComponent;

  resourceId = DataStore.userId;
  quickFormGroup: FormGroup;

  action: Action;

  constructor(
    public dialogRef: MatDialogRef<ActionQuickEditComponent>,
    public actionService: ActionService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
  }

  ngOnInit() {
    this.quickFormGroup = new FormGroup( {});
    this.createForm();
  }

  ngAfterViewInit() {
    this.quickFormGroup.addControl('pickerForm', this.simpleDateTimePicker.pickerForm);
    this.simpleDateTimePicker.pickerForm.setParent(this.quickFormGroup);
  }

  createForm = () => {
    this.quickFormGroup.addControl( 'actionName', new FormControl(this.action.name, [Validators.required]) );
    this.quickFormGroup.addControl( 'actionDescription', new FormControl(this.action.description, [Validators.required]), );
    this.quickFormGroup.addControl( 'activeAction', new FormControl(this.action.active) );
    this.quickFormGroup.addControl( 'actualCompletionDate', new FormControl(this.action.actualCompletionDate, [Validators.required]) );
    this.quickFormGroup.addControl( 'shouldDelete', new FormControl(false ) );
    this.disableCompletionDate();
  };

  get actionName() { return this.quickFormGroup.get('actionName'); }
  get actionDescription() { return this.quickFormGroup.get('actionDescription'); }
  get activeAction() { return this.quickFormGroup.get('activeAction'); }
  get actualCompletionDate() { return this.quickFormGroup.get('actualCompletionDate'); }
  get shouldDelete() { return this.quickFormGroup.get('shouldDelete'); }

  copyFormToAction = () => {
    this.action.name = this.actionName.value;
    this.action.description = this.actionDescription.value;
    this.action.active = this.activeAction.value;
    if ( this.actualCompletionDate.value ) {
      const completeDate = new Date(this.actualCompletionDate.value);
      this.action.actualCompletionDate =
        moment.tz( completeDate, 'Etc/UTC').format('YYYY-MM-DD HH:mm');
    }
  };

  disableCompletionDate = () => {
    const disableCompletionDate = this.activeAction.value;
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
      this.actionService.deleteAction(this.action.actionId).subscribe(feedback => {
        console.log('action deleted. We could close now');
        this.dialogRef.close('successfully deleted');
      });
    } else {
      this.copyFormToAction();
      this.actionService.updateAction(this.action).subscribe(feedback => {
        console.log('action updated. We could close now');
        this.dialogRef.close('successfully updated');
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close('no change');
  }

  routeToAction(): void {
    this.router.navigateByUrl( `/action/${this.action.actionId}` );
    this.dialogRef.close();
  }

  unreadyToSave(): boolean {
    return !(this.quickFormGroup.dirty && this.quickFormGroup.valid);
  }


}
