import { TestBed, inject } from '@angular/core/testing';

import { NoteService } from './note.service';

describe('NotesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteService]
    });
  });

  it('should be created', inject([NoteService], (service: NoteService) => {
    expect(service).toBeTruthy();
  }));
});
