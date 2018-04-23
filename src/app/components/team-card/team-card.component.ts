import {Component, OnInit, EventEmitter, Output} from '@angular/core';

import { CardComponent } from '../base/card/card.component';
import { Team } from '../../classes/team';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss']
})
export class TeamCardComponent extends CardComponent implements OnInit {
  fontColor = 'black';

  displayedColumns = ['teamId', 'name', 'description'];

  @Output() onTeamFlaggedForRemoval = new EventEmitter<string>();
  @Output() onTeamAssociatedToEntity = new EventEmitter<Team>();

  ngOnInit(): void {
    if (this.contactId) {
      this.teamService.getTeamListByContact( this.contactId )
        .subscribe(teams => this.entities = teams);
    } else {
      this.entities = [];
    }
  }

  onSelectTeam(team: Team) {
    this.router.navigateByUrl( `/team/${team.teamId}` );
  }

  onTeamAdded(team: Team) {
    this.onTeamAssociatedToEntity.emit(team);
    this.suspendedUndoEvent  = new Observable<any>(observer => {
      this.entities = this.entities.filter(e => e.teamId !== team.teamId);
      observer.next('undone');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  removeTeam(teamId: string) {
    this.onTeamFlaggedForRemoval.emit(teamId);
    this.suspendedEvent = new Observable<any> ( observer => {
      this.entities = this.entities.filter( e => e.teamId !== teamId );
      observer.next('success');
      observer.complete();
      return {unsubscribe() {}};
    });
  }

  createNewTeam(): void {
    if (this.contactId) {
      this.router.navigateByUrl( `/team/add/contact/${this.contactId}` );
    }
  }

  onSelectedTeam($event, teamId): void {
    this.router.navigateByUrl( `/team/${teamId}` );
  }
}
