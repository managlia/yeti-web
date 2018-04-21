import { Component, OnInit, Input, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as FileSaver from 'file-saver';
import {Attachment} from '../../classes/common/attachment';
import {Contact} from '../../classes/contact';
import * as _ from 'lodash';

import * as label from '../labels';
import {CardComponent} from '../base/card/card.component';

@Component({
  selector: 'app-attachment-list-card',
  templateUrl: './attachment-list-card.component.html',
  styleUrls: ['./attachment-list-card.component.scss']
})
export class AttachmentListCardComponent extends CardComponent implements OnInit, AfterViewInit {

  @Input() files: Attachment[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  activeFilter = 'true';
  typeFilter: string;
  textFilter = '';
  distinctUploaders: Contact[];
  uploaderFilter;

  displayedColumns = [ 'storageDate', 'entityData', 'fileUploader', 'fileType', 'fileName' ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify({
      general: '',
      uploaderFilter: 'all'
    });
    this.dataSource.data = this.files;
    this.setDistinctUploaders()
  }

  setDistinctUploaders = () => {
    const uploaders = this.files.map( attachment => attachment.uploaderData )
    this.distinctUploaders = _.uniqWith(uploaders, _.isEqual);
  };

  applyFilters() {
    this.textFilter = this.textFilter.trim(); // Remove whitespace
    this.textFilter = this.textFilter.toLowerCase(); // Datasource defaults to lowercase matches
    const filterValues = {
      general: this.textFilter,
      uploaderFilter: this.uploaderFilter ? this.uploaderFilter : 'all'
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      return (data.fileName.toString().toLowerCase().indexOf(searchTerms.general) !== -1)
        && (searchTerms.uploaderFilter === 'all' || (data.uploaderData &&
          (data.uploaderData.contactId === searchTerms.uploaderFilter)))
    };
    return filterFunction;
  }

  selectAttachment = (file) => {
    this.attachmentService.getFile(file.fileId, file.fileType)
      .then(blob => {
          const binaryData = [];
          binaryData.push(blob.body);
          FileSaver.saveAs(new Blob(binaryData), file.fileName);
        },
        error => console.log('error', error)
      );
  };

  selectEntity = (e) => {
    console.log('selecting entity', e);
    this.router.navigateByUrl( `/${e.entityType}/${e.entityId}` );
  };

  selectUploader = (e) => {
    this.router.navigateByUrl( `/contact/${e.uploaderId}` );
  };
}
