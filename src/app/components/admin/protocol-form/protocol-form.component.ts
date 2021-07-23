import {Component, OnInit} from '@angular/core';
import {IProtocol, IProtocolExt} from '../../../interfaces/protocol';
import {DatabaseService} from '../../../services/database.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IPlayer} from '../../../interfaces/player';
import {IGame} from '../../../interfaces/game';
import {IStat} from '../../../interfaces/stats';

declare const UIkit: any;

@Component({
  selector: 'app-stat-form',
  templateUrl: './protocol-form.component.html',
  styleUrls: ['./protocol-form.component.scss']
})

export class ProtocolFormComponent implements OnInit {
  public protocolId: number = null;
  public protocols: Array<IProtocolExt> = [];
  public protocol: IProtocolExt = null;
  public stats: Array<IStat> = [];
  public stat: IStat = null;
  public formProtocol: FormGroup;
  public players: Array<IPlayer> = [];
  public player: IPlayer = null;
  public games: Array<IGame> = [];
  public game: IGame = null;
  public gameId: number = null;
  public test1 = false;
  public test2 = false;
  public dateValue: string = null;
  public listSelectedPlayers: Array<number> = [];
  public statsOfPlayersForProtocol: Array<any> = [];
  public listStatsIds: Array<any> = [];
  // public protocolExt: Array<IProtocolExt> = [];
  public switchAddPlayers = false;

  constructor(
    private db: DatabaseService,
    private fm: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formProtocol = this.fm.group({
      name: ['', new Validators()],
      player_id: ['', new Validators()],
      game_id: ['', new Validators()],
      pa: ['', new Validators()],
      run: ['', new Validators()],
      rbi: ['', new Validators()],
      bb: ['', new Validators()],
      hbp: ['', new Validators()],
      one_b: ['', new Validators()],
      two_b: ['', new Validators()],
      three_b: ['', new Validators()],
      so: ['', new Validators()],
      go: ['', new Validators()],
      fo: ['', new Validators()],
    });
    this.onGetPlayers();
    this.onGetGames();
    this.onGetProtocols();
  }

  // Методы связанные с игроками

  public onSelectPlayer(id: number): void {
    if (this.listSelectedPlayers.includes(id)) {
      this.listSelectedPlayers.splice(this.listSelectedPlayers.indexOf(id), 1);
      this.statsOfPlayersForProtocol.forEach((item, i) => {
        if (item.player_id === id) {
          this.statsOfPlayersForProtocol.splice(i, 1);
        }
      });
    } else {
      this.stat = this.onGetStatModel();
      this.stat.player_id = id;
      const stats: any = this.getProtocolFormModel();
      stats.game_id = this.gameId;
      stats.player_id = id;
      this.statsOfPlayersForProtocol.push(stats);
      console.log(this.statsOfPlayersForProtocol);
      this.listSelectedPlayers.push(id);
    }
  }

  public onGetPlayerName(id: number): string {
    return this.players.filter(item => item.id === id)[0].name;
  }

  public onGetPlayers(): void {
    this.db.getAll('players', 'name').then((players: Array<IPlayer>) => {
      this.players = players;
    });
  }

  // Методы связанные с играми

  public onCheckGameId(id: any): void {
    if (id === null) {
      alert('Выберите игру');
    } else {
      const element = document.querySelector('#menu-select-player');
      UIkit.offcanvas(element).show();
    }
  }

  public onSelectGame(id: number): void {
    this.gameId = Number(id);
    this.formProtocol.value.game_id = this.gameId;
    this.db.get({table: 'games', target: [{key: 'id', value: id}]}).then((result: IGame) => {
      this.game = result[0];
      this.dateValue = this.onRebuildDate(result[0].date);
      this.protocol.game_id = result[0].id;
    });
  }

  public onGetGames(): void {
    this.db.getAll('games', 'date').then((games: Array<IGame>) => {
      this.games = games;
      this.games.forEach(item => item.date = this.onRebuildDate(item.date));
    });
  }

  private onRebuildDate(value: string): string {
    return new Date(Number(value)).toLocaleString().split(',')[0];
  }

  // Методы связанные с прокотоколами

  public async onSelectProtocol(id: number): Promise<void> {
    setTimeout(() => this.test1 = true, 3000);
    setTimeout(() => this.test2 = true, 5000);
    this.gameId = null;
    this.protocolId = Number(id);
    this.stat = this.onGetStatModel();
    if (this.protocolId === 0) {
      this.statsOfPlayersForProtocol = [];
      this.protocol = this.onGetProtocolModel();
    } else {
      this.statsOfPlayersForProtocol = [];
      this.protocol = this.onGetProtocolModel();
      const result: IProtocol = await this.db.get({table: 'protocols', target: [{key: 'id', value: this.protocolId}]});
      this.protocol = result[0];
      this.statsOfPlayersForProtocol = await this.db.get({table: 'stats', target: [{key: 'protocol_id', value: this.protocol.id}]});
      // this.protocol.stats_ids = JSON.parse(this.protocol.stats_ids);
      this.gameId = this.protocol.game_id;
    }
    this.formProtocol.value.name = this.protocol.name;
  }

  public onGetProtocols(): void {
    this.db.getAll('protocols', 'name').then((protocols: Array<IProtocol>) => {
      this.protocols = protocols;
    });
  }

  public async onUpdateNameProtocols(): Promise<void> {
    // tslint:disable-next-line:max-line-length
    const protocolsWithDate: Array<any> = await this.db.get({
      table: 'protocols',
      select: 'protocols.id id, protocols.name name, protocols.game_id game_id, games.date date',
      join: [{typeJoin: 'INNER', name: 'games', columnName: 'game_id'}]
    });
    console.log(protocolsWithDate);
    // tslint:disable-next-line:only-arrow-functions typedef
    protocolsWithDate.sort(function(a, b) {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });
    // tslint:disable-next-line:variable-name
    let number = 1;
    this.protocols = [];
    for (const protocol of protocolsWithDate) {
      protocol.name = `Протокол №${number}`;
      number += 1;
      delete protocol.date;
      this.protocols.push(protocol);
    }
    for (const protocol of this.protocols) {
      await this.db.update('protocols', protocol.id, protocol, 'id');
    }
  }

  public async onSaveProtocol(): Promise<void> {
    // tslint:disable-next-line:variable-name
    let _confirm: boolean = await confirm('Сохранить изменения?');
    console.log(this.protocol.game_id);
    this.gameId === null ? (alert('Выберите игру'), _confirm = false) : _confirm = true;
    if (_confirm) {
      this.protocol.name = this.formProtocol.value.name;
      if (this.protocolId === 0) {
        this.protocolId = await this.db.save('protocols', this.protocol);
        this.statsOfPlayersForProtocol.forEach(item => item.protocol_id = this.protocolId);
        console.log(this.statsOfPlayersForProtocol);
        for (const stat of this.statsOfPlayersForProtocol) {
          // tslint:disable-next-line:no-shadowed-variable
          await this.db.save('stats', stat);
        }
        this.protocol = null;
      } else {
        for (const stat of this.statsOfPlayersForProtocol) {
          await this.db.update('stats', stat.id, stat, 'id');
        }
        this.protocol = null;
      }
      this.onGetProtocols();
      await this.onUpdateNameProtocols();
    }
  }


  public onCheckSelect(id: number): boolean {
    return this.statsOfPlayersForProtocol.filter(item => item.player_id === id).length === 1;
  }

  private onGetProtocolModel(): IProtocol {

    return {
      name: '',
      game_id: 0,
    } as IProtocol;
  }

  private onGetStatModel(): IStat {
    return {
      player_id: 0,
      game_id: 0,
      pa: 0,
      run: 0,
      rbi: 0,
      bb: 0,
      hbp: 0,
      one_b: 0,
      two_b: 0,
      three_b: 0,
      so: 0,
      go: 0,
      fo: 0,
      protocol_id: 0,
    } as IStat;
  }


  public async onDeleteProtocol(id: number): Promise<void> {
    // tslint:disable-next-line:variable-name
    const _confirm: boolean = await confirm('Вы действительно хотите удалить протокол?');

    if (_confirm) {
      const result = await this.db.delete('protocols', id, 'id');
      if (result) {
        await this.db.delete('stats', id, 'protocol_id');
        this.onGetProtocols();
      }
      this.protocol = null;
    }
  }

  private onSetProtocol(): void {
    this.formProtocol.setValue({
      name: this.protocol.name,
    });
  }

  private getProtocolFormModel(): any {
    return {
      id: 0,
      player_id: 0,
      game_id: 0,
      protocol_id: 0,
      pa: 0,
      run: 0,
      rbi: 0,
      bb: 0,
      hbp: 0,
      one_b: 0,
      two_b: 0,
      three_b: 0,
      so: 0,
      go: 0,
      fo: 0,
    };
  }

  onTakeForm(stats: any) {
    for (const i of this.statsOfPlayersForProtocol) {
      const index = this.statsOfPlayersForProtocol.indexOf(i);
      if (i.player_id === stats.player_id) {
        this.statsOfPlayersForProtocol[index] = stats;
      }
    }
  }
}
