import { Component, OnInit, Input } from '@angular/core';

import { Company } from '../../classes/company';

@Component({
  selector: 'app-prospect-card',
  templateUrl: './prospect-card.component.html',
  styleUrls: ['./prospect-card.component.css']
})
export class ProspectCardComponent implements OnInit {
  @Input() company: Company;

  constructor() { }

  ngOnInit() {
  }

}
