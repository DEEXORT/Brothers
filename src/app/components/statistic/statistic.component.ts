import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {IUser} from '../../interfaces/user';
import {IPlayer, IPlayerExt} from '../../interfaces/player';
import {FormBuilder} from '@angular/forms';
import {IStat} from '../../interfaces/stats';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  public yearStat = null;
  public players: Array<IPlayerExt> = [];
  public player: IPlayer = null;
  public stats: Array<IStat> = [];
  public dateEndSeason: number = null;
  public dateStartSeason: number = null;
  // tslint:disable-next-line:variable-name
  public game_ids = [];
  public ids = '';
  public result: IStat[];

  constructor(
    private db: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // tslint:disable-next-line:use-isnan
    if (isNaN(this.activatedRoute.snapshot.params.year)) {
      this.yearStat = 'all';
    } else {
      this.yearStat = Number(this.activatedRoute.snapshot.params.year);
      this.dateStartSeason = new Date(`1.1.${this.yearStat}`).getTime();
    }
    // this.yearStat = Number(this.activatedRoute.snapshot.params.year);
    // this.dateValue = '1.1.' + String(this.yearStat);
    this.onGetPlayers();
  }

  // Методы, связанные с игроками
  public async onGetPlayers(): Promise<void> {
    this.players = await this.db.getAll('players', 'name');
    for (let i = 0; i < this.players.length; i++) {
      this.players[i] = Object.assign(this.players[i], await this.onGetStats(this.players[i].id));
    }
  }

  public async onGetStats(id: number): Promise<any> {
    const statsNames: string[] = ['pa', 'run', 'rbi',
      'bb', 'hbp', 'one_b', 'two_b', 'three_b', 'so', 'go', 'fo'];
    let reqSUM = '';

    for (const name of statsNames) {
      reqSUM += `SUM(stats.${name}) AS ${name}, `;
    }

    reqSUM = reqSUM.slice(0, reqSUM.length - 2);
    // const reqRows = this.db.get({table: 'stats', target: {key: 'player_id', value: id}, select: 'COUNT(1)'});
    // console.log('01.01.' + this.yearStat);
    // const newDate = this.onRebuildDate('1.1.' + this.yearStat);
    // tslint:disable-next-line:no-conditional-assignment use-isnan
    if (this.yearStat === 'all') {
      // Статистика за все время
      this.result = await this.db.get({
        table: 'stats',
        target: [{key: 'player_id', value: id}],
        select: reqSUM
      });
    } else {
      // Статистика за конкретный год
      this.dateEndSeason = this.dateStartSeason + 31536000000;
      // tslint:disable-next-line:variable-name
      this.game_ids = await this.db.get(
        {
          table: 'games',
          select: 'id',
          target: [{key: 'date', operator: '>', value: `${this.dateStartSeason}`, log_operator: 'AND'},
            {key: 'date', operator: '<', value: `${this.dateEndSeason}`, log_operator: ''}]
        });
      // AND date > ${this.seasonStartDate} OR date < ${this.seasonEndDate}
      // @ts-ignore
      for (const gameId of this.game_ids) {
        this.ids += `game_id = ${gameId.id} OR `;
      }
      if (this.ids.length > 3) {
        const addition = `AND (${this.ids.slice(0, -3)})`;
        // AND (game_id = 1 OR game_id = 2 OR ...)
        this.result = await this.db.get({
          table: 'stats',
          target: [{key: 'player_id', value: id, addition: `${addition}`}],
          select: reqSUM
        });
      }
    }
    return this.result.map(item => {
      for (const key of Object.keys(item)) {
        item[key] = item[key] === null ? 0 : item[key];
      }

      item.ab = item.one_b + item.two_b + item.three_b + item.so + item.go + item.fo;
      item.avg = ((item.one_b + item.two_b + item.three_b) / item.ab) || 0;
      item.obp = ((item.one_b + item.two_b + item.three_b + item.bb +
        item.hbp) / (item.ab + item.bb + item.hbp)) || 0;
      return item;
    })[0];

  }
}
