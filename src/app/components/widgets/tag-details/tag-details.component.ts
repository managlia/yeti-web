import {Component, OnInit, Inject, ViewChild, ElementRef, ComponentRef, AfterViewInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteTrigger, MatFormField} from '@angular/material';
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import * as _ from 'lodash';

import {DataStore} from '../../../classes/data-store';
import {Tag} from '../../../classes/common/tag';
import {Observable} from 'rxjs/Observable';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.css']
})
export class TagDetailsComponent implements OnInit {

  @ViewChild('chipSearch') input: ElementRef;
  @ViewChild('chipSearch', {read: MatAutocompleteTrigger}) autoComplete: MatAutocompleteTrigger;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  wholeTagList: Tag[];
  currentTags: string[];
  results$: Observable<string[]>;
  private searchTerms = new Subject<string>();
  flagAsInvalid = false;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  constructor(
    private dataStore: DataStore,
    public dialogRef: MatDialogRef<TagDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.wholeTagList = this.data.wholeTagList;
    this.currentTags = _.cloneDeep(this.data.tags.map(aTag => aTag.name)).sort();
  }

  ngOnInit() {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchForTags(term)),
    );
  }

  searchForTags(term: string): Observable<string[]> {
    return new Observable<string[]>(observer => {
      if (term && term.length > 0) {
        let wholeList =
          this.wholeTagList.map(e => e.name).filter(g => g.toLowerCase().startsWith(term.toLowerCase()));
        wholeList =
          wholeList.filter( e =>  !this.currentTags.includes(e));
        observer.next(wholeList);
      }
      observer.complete();
      return {
        unsubscribe() {
        }
      };
    });
  }

  search(term: string): void {
    if (term && term.length > 0) {
      this.flagAsInvalid = false;
    }
    this.searchTerms.next(term);
  }

  add(existingValue: string): void {
    if (existingValue && existingValue.trim().length > 1) {
      existingValue = existingValue.trim();
      const foundIndex = this.wholeTagList.findIndex(e => e.name.toLowerCase() === existingValue.toLowerCase());
      existingValue = (foundIndex > 0) ? this.wholeTagList[foundIndex].name : existingValue;

      if (this.currentTags.findIndex(e => e.toLowerCase() === existingValue.toLowerCase()) > 0) {
        console.log('do not add since it is here already');
        this.flagAsInvalid = true;
      } else {
        this.currentTags.push(existingValue);
        this.currentTags = this.currentTags.sort();
      }
      this.input.nativeElement.value = '';

      // this.input.nativeElement.focus();
      this.autoComplete.closePanel();
    }
  }

  remove(tag: string): void {
    this.currentTags = this.currentTags.filter(e => e !== tag);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  processDone(): void {
    this.dialogRef.close(this.currentTags.sort());
  }

  closeWithoutSaving(): void {
    this.dialogRef.close();
  }
}
