import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { DataStore } from '../../../classes/data-store';

@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.css']
})
export class TagDetailsComponent implements OnInit {

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  constructor(
    private dataStore: DataStore,
    public dialogRef: MatDialogRef<TagDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.data.push({
        name: value.trim(),
        description: value.trim(),
        creatorId: this.dataStore.userId
      });
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    console.log('trying to remove ' + tag );
    console.log(tag + ' index is ' +  this.data.indexOf(tag));

    const index = this.data.indexOf(tag);

    if (this.data.length >= 0) {
      console.log('in the if');
      this.data.splice(index, 1);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
