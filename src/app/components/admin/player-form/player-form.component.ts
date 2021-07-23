import {Component, OnInit} from '@angular/core';
import {IPlayer} from '../../../interfaces/player';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatabaseService} from '../../../services/database.service';
import {IPosition} from '../../../interfaces/position';
import {Md5} from 'md5-typescript';
import {IAuth} from '../../../interfaces/auth';

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
  public auth: IAuth = null;

  constructor(
    private db: DatabaseService,
    private fm: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formPlayer = this.fm.group({
      name: ['', new Validators()],
      bat: ['', new Validators()],
      throw: ['', new Validators()],
      login: ['', new Validators()],
      role: ['', new Validators()],
      password: ['', new Validators()],
      game_number: ['', new Validators()],
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
      this.auth = this.onGetAuthModel();
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
      this.auth = this.onGetAuthModel();
    }
  }


  private onSetPlayer(): void {
    this.formPlayer.setValue({
      name: this.player.name,
      bat: this.player.bat,
      throw: this.player.throw,
      game_number: this.player.game_number,
      login: '',
      password: '',
      role: this.player.role
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
        console.log(true);
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
      const auth: IAuth = this.auth;
      auth.login = this.formPlayer.value.login;
      auth.password = this.formPlayer.value.password;
      player.game_number = player.game_number === '' ? '---' : player.game_number;
      auth.role = this.formPlayer.value.role === '' ? 'Пользователь' : this.formPlayer.value.role;
      player.role = auth.role;
      // Хеширование пароля
      const salt = Math.random().toString(36).substring(7);
      auth.password = Md5.init(auth.password + salt);
      auth.salt = salt;
      auth.player_id = this.player.id;
      player.name = this.formPlayer.value.name;
      player.bat = this.formPlayer.value.bat;
      player.throw = this.formPlayer.value.throw;
      this.onSetPlayer();

      if (this.playerId === 0) {
        this.db.save('players', player).then(result => {
          if (result) {
            this.position.player_id = result;
            auth.player_id = result;
            // tslint:disable-next-line:variable-name
            this.db.save('positions', this.position).then(_result => {
              if (_result) {
                this.db.save('users', auth).then(resultant => {
                  if (resultant) {
                    this.onGetPlayers();
                  }
                });
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
                this.db.update('users', this.player.id, auth, 'player_id').then(resultant => {
                  if (resultant) {
                    this.onGetPlayers();
                  }
                });
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

  private onGetAuthModel(): IAuth {
    return {
      player_id: 0,
      login: '',
      role: '',
      password: '',
      salt: ''
    } as IAuth;
  }

  private onGetPlayerModel(): IPlayer {
    return {
      name: '',
      bat: '',
      throw: '',
      game_number: '',
      role: '',
      defeatPosition: []
    } as IPlayer;
  }

  public transliterate(text, engToRus): string {
    // tslint:disable-next-line:prefer-const one-variable-per-declaration
    let rus = 'щ   ш  ч  ц  ю  я  ё  ж  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь'.split(/ +/g),
      // tslint:disable-next-line:prefer-const
      eng = 'shh sh ch cz yu ya yo zh  i e a b v g d e z i j k l m n o p r s t u f x '.split(/ +/g);
    for (let x = 0; x < rus.length; x++) {
      text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
      // tslint:disable-next-line:max-line-length
      text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
    }
    return text;

  }

}
