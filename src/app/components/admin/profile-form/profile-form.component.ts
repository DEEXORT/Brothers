import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IPlayer} from '../../../interfaces/player';
import {DatabaseService} from '../../../services/database.service';
import {IPosition} from '../../../interfaces/position';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  public playerId = null;
  public player: IPlayer = null;
  public position: IPosition = null;

  constructor(
    private db: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.playerId = Number(this.activatedRoute.snapshot.params.id);
    console.log(this.playerId);
    this.onGetPlayer().then();
  }

  public async onGetPlayer(): Promise<void> {
    const result: IPlayer = await this.db.get({table: 'players', target: [{key: 'id', value: this.playerId}]});
    this.player = result[0];
    // tslint:disable-next-line:variable-name
    const _result: IPosition = await this.db.get({
      table: 'positions',
      target: [{key: 'player_id', value: this.playerId}]
    });
    this.position = _result[0];
  }

}
