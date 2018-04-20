import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import {Note} from '../classes/note';

import {BaseService} from './base.service';
import {ServiceConstants} from '../service-constants';

@Injectable()
export class NoteService extends BaseService {

  noteUrl = ServiceConstants.NOTE_URL;

  cd = 'note'; // 'componentDescription'

  getOneEmailStatement = (cd: string) => `${cd} one EMAIL ${this.whoseId} `;

  getNoteList(): Observable<Note[]> {
    this.logger.debug(`${this.P}${this.getAllStatement(this.cd)}`);
    return this.http.get<Note[]>(this.noteUrl, {
      headers: BaseService.headers} )
      .pipe(
        tap(notes => this.logger.debug(`${this.S}${this.getAllStatement(this.cd)}`)),
        catchError(this.handleError(`${this.E}${this.getAllStatement(this.cd)}`, []))
      );
  }

  getNoteListForEntity( entityType: string, entityId: string ): Observable<Note[]> {
    return this.getNoteListByFilter(entityType, entityId);
  }

  getNoteListByFilter(entityType: string, entityId: string): Observable<Note[]> {
    this.logger.debug(`${this.P}${this.getAllFilterStatement(this.cd)} ${entityId}`);
    const url = `${this.noteUrl}?entityType=${entityType}&entityId=${entityId}`;
    return this.http.get<Note[]>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(notes => this.logger.debug(`${this.S}${this.getAllFilterStatement(this.cd)} ${entityId}`)),
        catchError(this.handleError(`${this.E}${this.getAllFilterStatement(this.cd)} ${entityId}`, []))
      );
  }

  getNote(id: string): Observable<Note> {
    this.logger.debug(`${this.P}${this.getOneStatement(this.cd)} ${id}`);
    const url = `${this.noteUrl}/${id}`;
    return this.http.get<Note>(url, {
      headers: BaseService.headers} )
      .pipe(
        tap(result => this.logger.debug(`${this.S}${this.getOneStatement(this.cd)}${id}`)),
        catchError(this.handleError<Note>(`${this.E}${this.getOneStatement(this.cd)} ${id}`))
      );
  }

  addNote(note: Note): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.postStatement(this.cd)}`);
    return this.http.post(this.noteUrl, note, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(response => this.logger.debug(`${this.S}${this.postStatement(this.cd)}${response.headers.get('Location')}`)),
        catchError(this.handleError<any>(`${this.E}${this.postStatement(this.cd)}`))
      );
  }

  updateNote(note: Note): Observable<HttpResponse<any>> {
    const id = note.noteId;
    this.logger.debug(`${this.P}${this.putStatement(this.cd)} ${id}`);
    const url = `${this.noteUrl}/${note.noteId}`;
    return this.http.put(url, note, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.putStatement(this.cd)} ${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.putStatement(this.cd)} ${id}`))
      );
  }

  deleteNote(id: string): Observable<HttpResponse<any>> {
    this.logger.debug(`${this.P}${this.deleteStatement(this.cd)} ${id}`);
    const url = `${this.noteUrl}/${id}`;
    return this.http.delete(url, {
      headers: BaseService.headers,
      responseType: BaseService.responseTypeValue,
      observe: BaseService.observeValue} )
      .pipe(
        tap(_ => this.logger.debug(`${this.S}${this.deleteStatement(this.cd)}${id}`)),
        catchError(this.handleError<any>(`${this.E}${this.deleteStatement(this.cd)} ${id}`))
      );
  }

  closeNote(id: string): Observable<any> {
    // TODO: implement patch for the close note
    this.logger.debug(`TODO:${this.patchStatement(this.cd)}`);
    return null;
  }
}
