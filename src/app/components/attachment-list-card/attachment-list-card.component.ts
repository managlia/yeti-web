import { Component, OnInit, Input, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as FileSaver from 'file-saver';

import * as label from '../labels';
import {CardComponent} from '../base/card/card.component';

@Component({
  selector: 'app-attachment-list-card',
  templateUrl: './attachment-list-card.component.html',
  styleUrls: ['./attachment-list-card.component.scss']
})
export class AttachmentListCardComponent extends CardComponent implements OnInit, AfterViewInit {

  @Input() files: File[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  activeFilter = 'true';
  typeFilter: string;
  textFilter = '';

  displayedColumns = [ 'fileCreateDate', 'fileEntity', 'fileUploader', 'fileLink' ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    // this.dataSource.filterPredicate = this.createFilter();
    // this.dataSource.filter = JSON.stringify({
    //   general: '',
    //   entityType: 'all',
    //   entityId: 'all'
    // });
    console.log('the files', this.files);
    this.dataSource.data = this.files;
  }

  applyFilters() {
    this.textFilter = this.textFilter.trim(); // Remove whitespace
    this.textFilter = this.textFilter.toLowerCase(); // Datasource defaults to lowercase matches
    const filterValues = {
      general: this.textFilter,
      activeStatus: this.activeFilter,
      typeStatus: this.typeFilter ? this.typeFilter : 'all',
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      return (
        data.fileType.toString().toLowerCase().indexOf(searchTerms.general) !== -1
        || data.fileName.toString().toLowerCase().indexOf(searchTerms.general) !== -1)
        && (searchTerms.entityType === 'all' || data.entityType === searchTerms.entityType)
        && (searchTerms.entityId === 'all' || data.entityId === searchTerms.entityId)
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
