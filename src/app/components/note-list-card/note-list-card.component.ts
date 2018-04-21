import {Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatSortable, MatTableDataSource } from '@angular/material';

import { NoteService } from '../../services/note.service';
import { Note } from '../../classes/note';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ScopeType} from '../../classes/types/scope-type';
import {ActionClassificationOtherType} from '../../classes/types/action-classification-other-type';
import {ActionClassificationType} from '../../classes/types/action-classification-type';

@Component({
  selector: 'app-note-list-card',
  templateUrl: './note-list-card.component.html',
  styleUrls: ['./note-list-card.component.scss']
})
export class NoteListCardComponent implements OnInit, AfterViewInit {

  @Input() entityType: string;
  @Input() entityId: string;
  @Input() resourceId: string;
  notes: Note[] = [ new Note() ];
  viewNoteForm = false;
  noteFormGroup: FormGroup;


  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [ 'createDate', 'description', 'value', 'creatorId' ];

  textFilter = '';

  constructor(
    private noteService: NoteService
  ) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify({
      general: ''
    });
    this.getNotesList();
  }

  createForm = () => {
    this.noteFormGroup = new FormGroup({
      noteDescription: new FormControl('', [Validators.required]),
      noteValue: new FormControl('', [Validators.required])
    });
  };

  get noteDescription() { return this.noteFormGroup.get('noteDescription'); }
  get noteValue() { return this.noteFormGroup.get('noteValue'); }

  applyFilters() {
    this.textFilter = this.textFilter.trim(); // Remove whitespace
    this.textFilter = this.textFilter.toLowerCase(); // Datasource defaults to lowercase matches
    const filterValues = {
      general: this.textFilter
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      return (
        data.value.toString().toLowerCase().indexOf(searchTerms.general) !== -1
        || data.description.toString().toLowerCase().indexOf(searchTerms.general) !== -1)
    };
    return filterFunction
  }

  onNoteSelected = (note: Note) => {
    console.log('note: ', note);
  };

  addNote = () => {
    this.viewNoteForm = false;
    const note = new Note();
    note.value = this.noteValue.value;
    note.description = this.noteDescription.value;
    note.creatorId = this.resourceId;
    note.entityType = this.entityType;
    note.entityId = this.entityId;
    this.noteService.addNote(note)
      .subscribe(e => {
        this.viewNoteForm = false;
        this.noteFormGroup = null;
        this.getNotesList();
      });
  };

  resetForm = () => {
    this.viewNoteForm = false;
    this.noteFormGroup = null;
  };

  possiblyTriggerErrorMessages = () => {
    if ( this.noteFormGroup.invalid ) {
      console.log('marking as touched!!!');
      this.noteDescription.markAsTouched();
      this.noteValue.markAsTouched();
    }
  };

  showNewNoteForm = () => {
    this.createForm();
    this.viewNoteForm = true;
    console.log('todo: display a form to enter data.');
  };

  getNotesList = () => {
    if ( this.entityType && this.entityId ) {
        this.noteService.getNoteListForEntity(this.entityType, this.entityId)
          .subscribe(e => {
            this.dataSource.data = e;
            this.sort.sort(<MatSortable>{
                id: 'createDate',
                start: 'desc'
              }
            );
          });
    } else {
      console.error('entityType and/or entityId not defined');
    };
  };
}
