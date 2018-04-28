import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CardComponent} from '../base/card/card.component';
import { Team } from '../../classes/team';

@Component({
  selector: 'app-team-filter-card',
  templateUrl: './team-filter-card.component.html',
  styleUrls: ['./team-filter-card.component.scss']
})
export class TeamFilterCardComponent extends CardComponent implements OnInit {

  @Output() filterUpdated = new EventEmitter<any>();

  teams: Team[];

  teamOnly: boolean; // the radio

  // the checkboxes
  mine: boolean;
  myTeams: boolean;
  companyWide: boolean;
  teamId: string;

  ngOnInit(): void {
    if (this.resourceId) {
      this.teamService.getTeamListByContact( this.resourceId )
        .subscribe(teams => this.teams = teams);
    } else {
      this.entities = [];
    }
    this.initValues();
    this.applyFilter();
  }

  applyFilter = () => {
    console.log('==> teamOnly == ' + this.teamOnly );
    console.log('==> mine == ' + this.mine );
    console.log('==> myTeams == ' + this.myTeams );
    console.log('==> companyWide == ' + this.companyWide );
    console.log('==> teamId == ' + this.teamId );
    this.filterUpdated.emit( {
      fatFilterInEffect: true,
      teamOnly: this.teamOnly,
      mine: this.mine,
      myTeams: this.myTeams,
      companyWide: this.companyWide,
      teamId: this.teamId,
    });
  };

  initValues = () => {
    this.teamOnly = false;
    this.mine = true;
    this.myTeams = true;
    this.companyWide = true;
    this.teamId = null;
  };

  flipToTeamsOnly = () => {
    console.log('flipping to team only');
    this.mine = false;
    this.myTeams = false;
    this.companyWide = false;
  };

  bySelectedTeam = () => {
    console.log('in bySelectedTeam');
    if ( !this.teamOnly ) {
      this.teamOnly = true;
      this.flipToTeamsOnly();
    }
    this.applyFilter();
  };

  withMine = (chosenValue: boolean) => {
    console.log('in withMine');
    if ( this.teamOnly ) {
      this.teamOnly = false;
      this.teamId = '';
    }
    this.applyFilter();
  };

  withMyTeams = (chosenValue: boolean) => {
    console.log('in withMyTeams');
    if ( this.teamOnly ) {
      this.teamOnly = false;
      this.teamId = '';
    }
    this.applyFilter();
  };

  withCompanyWide = (chosenValue: boolean) => {
    console.log('in withCompanyWide');
    if ( this.teamOnly ) {
      this.teamOnly = false;
      this.teamId = '';
    }
    this.applyFilter();
  };

  onRadioToggled = (chosenValue: boolean) => {
    console.log('in onRadioToggled');
    if ( !this.teamOnly ) {
      this.flipToTeamsOnly();
    } else {
      this.initValues();
    }
    this.applyFilter();
  };
}
