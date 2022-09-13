import {Component, OnInit} from '@angular/core';
import {IPlayer} from '../../../interfaces/player';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatabaseService} from '../../../services/database.service';
import {IPosition} from '../../../interfaces/position';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss']
})
export class PlayerFormComponent implements OnInit {
  public players: Array<IPlayer> = [];
  public player: IPlayer = null;
  public playerId: number = null;
  public formPlayer: FormGroup;
  public position: IPosition = null;
  public fileName = '';
  uploadProgress: number;
  uploadSub: Subscription;

  constructor(
    private db: DatabaseService,
    private fm: FormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.formPlayer = this.fm.group({
      name: ['', new Validators()],
      bat: ['', new Validators()],
      throw: ['', new Validators()],
      game_number: ['', new Validators()],
      photo: ['', new Validators()]
    });
    this.onGetPlayers();
  }

  public onGetPlayers(): void {
    this.db.getAll('players', 'name').then((players: Array<IPlayer>) => {
      this.players = players;
    });
  }

  public onSelectPlayer(id: number): void {
    this.playerId = Number(id);
    if (this.playerId === 0) {
      this.player = this.onGetPlayerModel();
      this.position = this.onGetPositionClear();
      this.onSetPlayer();
    } else {
      this.db.get({table: 'players', target: [{key: 'id', value: this.playerId}]}).then((result: IPlayer) => {
        this.player = result[0];
        console.log(this.player.name);
      });
      this.db.get({table: 'positions', target: [{key: 'player_id', value: this.playerId}]}).then((result: IPosition) => {
        this.position = result[0];
        this.onSetPlayer();
      });
    }
  }


  private onSetPlayer(): void {
    this.formPlayer.setValue({
      name: this.player.name,
      bat: this.player.bat,
      throw: this.player.throw,
      game_number: this.player.game_number,
      photo: this.player.photo
    });
    this.position = {
      player_id: this.position.player_id,
      pitcher: this.position.pitcher,
      catcher: this.position.catcher,
      firstBase: this.position.firstBase,
      secondBase: this.position.secondBase,
      thirdBase: this.position.thirdBase,
      shortStop: this.position.shortStop,
      leftField: this.position.leftField,
      centralField: this.position.centralField,
      rightField: this.position.rightField
    };
  }

  public onDeletePlayer(id: number): void {
    this.db.delete('stats, positions', id, 'player_id').then(result => {
      if (result) {
        console.log(result);
      }
    });
    this.db.delete('players', id, 'id').then(result => {
      if (result) {
        this.onGetPlayers();
        this.player = null;
      }
      this.player = null;
    });
  }

  public onPositionSwitch(key: string): void {
    this.position[key] = this.position[key] === 0 ? 1 : 0;
  }

  public async onSavePlayer(): Promise<void> {
    // tslint:disable-next-line:variable-name
    const _confirm: boolean = await confirm('Сохранить изменения?');

    if (_confirm) {

      const player: IPlayer = this.player;
      // Хеширование пароля
      const salt = Math.random().toString(36).substring(7);
      player.name = this.formPlayer.value.name;
      player.bat = this.formPlayer.value.bat;
      player.throw = this.formPlayer.value.throw;
      // tslint:disable-next-line:no-unused-expression
      player.game_number = this.formPlayer.value.game_number === '' ? '---' : this.formPlayer.value.game_number;
      this.onSetPlayer();
      if (this.playerId === 0) {
        this.db.save('players', player).then(result => {
          if (result) {
            this.position.player_id = result;
            // tslint:disable-next-line:variable-name
            this.db.save('positions', this.position).then(_result => {
              if (_result) {
                  this.onGetPlayers();
              }
              this.player = null;
            });
          }
        });
      } else {
        this.db.update('players', this.playerId, player, 'id').then(result => {
          if (result) {
            this.position.player_id = this.player.id;
            // tslint:disable-next-line:variable-name
            this.db.update('positions', this.player.id, this.position, 'player_id').then(_result => {
              if (_result) {
                  this.onGetPlayers();
              }
              this.player = null;
            });
          }
        });
      }
    }
  }

  private onGetPositionClear(): IPosition {
    return {
      player_id: 0,
      pitcher: 0,
      catcher: 0,
      firstBase: 0,
      secondBase: 0,
      thirdBase: 0,
      shortStop: 0,
      leftField: 0,
      centralField: 0,
      rightField: 0
    };
  }

  private onGetPlayerModel(): IPlayer {
    return {
      name: '',
      bat: '',
      throw: '',
      game_number: '',
      photo: ''
    } as IPlayer;
  }
}
