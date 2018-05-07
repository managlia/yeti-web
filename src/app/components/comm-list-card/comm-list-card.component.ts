import {Component, Input, OnInit, AfterViewInit, ViewChild, OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';
import { MatPaginator, MatSort, MatSortable, MatTableDataSource } from '@angular/material';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';

import { NoteService } from '../../services/note.service';
import { Note } from '../../classes/comms/note';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AnnouncementService} from '../../services/announcement.service';
import {MemoService} from '../../services/memo.service';
import {CommAuditService} from '../../services/comm-audit.service';

import {CommAudit} from '../../classes/comms/comm-audit';
import {DataStore} from '../../classes/data-store';
import {Announcement} from '../../classes/comms/announcement';

@Component({
  selector: 'app-comm-list-card',
  templateUrl: './comm-list-card.component.html',
  styleUrls: ['./comm-list-card.component.scss']
})
export class CommListCardComponent implements OnInit, AfterViewInit, OnChanges {

  @Output() triggerReply = new EventEmitter<any>();
  @Input() refreshData = false;
  @Input() commCanceled = false;
  notes: Note[] = [ new Note() ];
  viewNoteForm = false;
  noteFormGroup: FormGroup;

  showPinned = true;
  showAnnouncements = true;
  showMemos = true;
  includeReadItems = true;

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [ 'createDate', 'creatorDescription', 'value', 'type' ];

  textFilter = '';

  constructor(
    public memoService: MemoService,
    public noteService: NoteService,
    public commAuditService: CommAuditService
  ) {
  }

  ngOnChanges( changes: SimpleChanges) {
    console.log('list learned that ')
    if ( changes.refreshData && changes.refreshData.currentValue ) {
      this.getNotesList();
      this.refreshData = false;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify({
      general: '',
      showMemos: this.showMemos,
      showAnnouncements: this.showAnnouncements,
      includeReadItems: this.includeReadItems
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
      general: this.textFilter,
      showMemos: this.showMemos,
      showAnnouncements: this.showAnnouncements,
      includeReadItems: this.includeReadItems
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      return (
        (data.value.toString().toLowerCase().indexOf(searchTerms.general) !== -1
        || data.description.toString().toLowerCase().indexOf(searchTerms.general) !== -1))
        && (searchTerms.showMemos || data.type !== 'memo')
        && (searchTerms.showAnnouncements || data.type !== 'announcement')
        && (searchTerms.includeReadItems || (!data.audit) || (!data.audit.haveRead) )

    };
    return filterFunction
  }

  onNoteSelected = (note: Note) => {
    console.log('note: ', note);
  };

  sortTheDataSource = () => {
    this.dataSource.data = this.dataSource.data.sort((a: Announcement, b: Announcement) => {
      const ma = moment(a.createDate);
      const mb = moment(b.createDate);
      const pa = this.getPriority(a);
      const pb = this.getPriority(b);
      if (pa < pb) {
        return -1;
      }
      if (pa > pb) {
        return 1;
      }
      if (ma.isBefore(mb)) {
        return 1;
      }
      if (mb.isBefore(ma)) {
        return -1;
      }
      return 0;
    });
  };

  addNote = () => {
    this.viewNoteForm = false;
    const note = new Note();
    note.value = this.noteValue.value;
    note.description = this.noteDescription.value;
    note.creatorId = DataStore.userId;
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
  };

  getNotesList = () => {
      this.dataSource.data = [];
      const p1 = this.memoService.getMemoList();
      p1.subscribe(e => {
          this.dataSource.data = _.union(e, this.dataSource.data);
      });
      Promise.all([p1.toPromise()]).then( result => {
        this.sortTheDataSource();
      });
  };

  getPriority = (comm: Announcement) => {
    if ( this.showPinned && comm.audit && comm.audit.havePinned ) {
      return 1;
    } else if ( comm.audit === undefined ) {
      return 2;
    } else if ( !comm.audit.haveRead ) {
      return 2;
    } else {
      return 3;
    }
  };

  isPinned = (note) => note.audit && note.audit.havePinned;

  highlightClass = (note) => {
    if (note.audit && note.audit.havePinned) {
      return 'is_pinned';
    } else if (note.audit && note.audit.haveRead) {
      return 'is_read';
    } else {
      return 'is_unread';
    }
  };

  noteItemRead = (note) => {
    this.updateAudit(note, false).subscribe( e => {
      note = e;
      this.getNotesList();
    });
  };

  replyToNote = (note) => {
    if ( !note.audit || !note.audit.haveRead ) {
      this.noteItemRead(note);
    }
    this.triggerReply.emit(note);
  };

  pinNote = (note, pinIt: boolean) => {
    this.updateAudit(note, pinIt).subscribe( e => {
      console.log('what is returned', e);
      this.getNotesList();
    });
  };

  updateAudit = (note, markPinned) => {
    if ( !note.audit ) {
      note.audit = new CommAudit();
    }
    note.audit.userId = DataStore.userId;
    note.audit.commId = note.noteId ? note.noteId : note.memoId;
    note.audit.haveRead = true;
    note.audit.havePinned = markPinned;
    if ( !note.audit.firstSeenDate ) {
      note.audit.firstSeenDate = new Date();
    } else {
      note.audit.firstSeenDate = undefined;
    }
    note.audit.lastSeenDate = new Date();

    return this.commAuditService.updateAudit(note.audit);
  };
}

