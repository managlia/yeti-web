import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as _ from 'lodash';

import {BaseViewComponent} from '../../components/base/base-view/base-view.component';
import {Team} from '../../classes/team';
import {Contact} from '../../classes/contact';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent extends BaseViewComponent implements OnInit {

  team: Team;
  ngOnInit() {
    this.entityName = 'team';
    window.scrollTo(0, 0);
    this.getTeam();
  }

  resetForm = () => {
    this.entityFormGroup.reset();
    this.resetTheDirty();
    this.getTeam();
  };

  createForm() {
    this.entityFormGroup = this.formBuilder.group({ // <-- the parent FormGroup
      teamName: new FormControl(this.team.name, [Validators.required]),
      description:  new FormControl(this.team.description, [Validators.required]),
      activeTeam:  new FormControl(this.team.active)
    });
    this.entityLoaded = true;
  }

  get teamName() { return this.entityFormGroup.get('teamName'); }
  get description() { return this.entityFormGroup.get('description'); }
  get activeTeam() { return this.entityFormGroup.get('activeTeam'); }

  copyFormToTeam = () => {
    this.team.name = this.teamName.value;
    this.team.description = this.description.value;
    this.team.active = this.activeTeam.value;
  }

  getTeam(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.teamService.getTeam(teamId).subscribe(
        team => {
          this.team = team;
          this.createForm();
        });
    } else {
      this.team = new Team();
      this.entity = this.route.snapshot.paramMap.get('entity');
      this.entityId = this.route.snapshot.paramMap.get('entityId');
      this.createForm();
    }
  }

  addUpdateTeam() {
    const teamId = this.team.teamId;
    this.copyFormToTeam();
    if (teamId) {
      this.teamService.updateTeam(this.team).subscribe(result => {
        this.showAssocationSuccessful('team');
        // getting fresh data to make sure updates are working
        this.getTeam();
      });
    } else {
      this.team.creatorId = this.dataStore.userId;
      if (this.entity && this.entityId) {
        this.teamService.addTeam(this.team).toPromise().then(
          response => this.completeAssociation(response.headers.get('Location'), this.entity, this.entityId) );
      } else {
        this.teamService.addTeam(this.team).subscribe(
          response => this.updateRoute(response.headers.get('Location')));
      }
    }
  }

  completeAssociation(location: string, entity: string, entityId: string) {
    const newId = _.last(_.split(location, '/'));
    if (entity === 'contact') {
      this.contactService.getContact(entityId).toPromise().then(
        contact => this.teamService.addContactToTeam(newId, contact).subscribe(
          response => this.updateRoute(location)
        ));
    }
  }

  onTeamFlaggedForRemoval(teamId: string) {
    this.teamService.removeContactFromTeam(this.team.teamId, this.dataStore.userId).subscribe(
      response => this.showAssocationSuccessful('team'),
      error => this.handleAssociationFailure('team'));
  }


  onContactAssociatedToEntity(contact: Contact): void {
    this.teamService.addContactToTeam(this.team.teamId, contact).subscribe(
      response => this.showAssocationSuccessful('contact'),
      error => this.handleAssociationFailure('contact'));
  }

  onContactFlaggedForRemoval(contactId: string) {
    this.teamService.removeContactFromTeam(this.team.teamId, contactId).subscribe(
      response => this.showAssocationSuccessful('contact'),
      error => this.handleAssociationFailure('contact'));
  }
}







