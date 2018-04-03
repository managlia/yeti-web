import { Component, OnInit, Input } from '@angular/core';

import { Company } from '../../classes/company';
import { Contact } from '../../classes/contact';

@Component({
  selector: 'app-phone-card',
  templateUrl: './phone-card.component.html',
  styleUrls: ['./phone-card.component.css']
})
export class PhoneCardComponent implements OnInit {
  @Input() company: Company;
  @Input() contact: Contact;

  constructor() { }

  ngOnInit() {
  }

}
