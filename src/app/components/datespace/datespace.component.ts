import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-datespace',
  templateUrl: './datespace.component.html',
  styleUrls: ['./datespace.component.scss']
})
export class DatespaceComponent implements OnInit {

  @Input() entity: any;

  constructor() { }

  ngOnInit() {
  }

}
