import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {IUser} from '../../interfaces/user';
import {IPlayer, IPlayerExt} from '../../interfaces/player';
import {FormBuilder} from '@angular/forms';
import {IStat} from '../../interfaces/stats';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit, OnDestroy {
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
  private subscription: Subscription;

  constructor(
    private db: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params
      .subscribe(params => {
      // tslint:disable-next-line:use-isnan
      if (isNaN(params.year)) {
        this.yearStat = 'all';
      } else {
        this.yearStat = Number(params.year);
        this.dateStartSeason = new Date(`1.1.${this.yearStat}`).getTime();
      }
      // this.yearStat = Number(this.activatedRoute.snapshot.params.year);
      // this.dateValue = '1.1.' + String(this.yearStat);
      this.onGetStats(1);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Методы, связанные с игроками
  public async onGetPlayers(): Promise<void> {
    console.log(this.yearStat);
    this.players = await this.db.getAll('players', 'name');
    for (let i = 0; i < this.players.length; i++) {
      this.players[i] = Object.assign(this.players[i], await this.onGetStats(this.players[i].id));
      if (this.yearStat === 'all'){
        await this.db.get({
          table: 'stats',
          select: 'COUNT(*) AS count_game',
          target: [{key: 'player_id', value: this.players[i].id}]}).then(res => {
          this.players[i].game_number = res[0].count_game;
        });
      } else {
        await this.db.get({
          table: 'stats',
          select: 'COUNT(*) AS count_game',
          join: [{typeJoin: 'INNER', name: 'games', columnName: 'game_id'}],
          target: [{key: 'player_id', value: this.players[i].id, log_operator: 'AND'},
            {key: 'date', operator: '>', value: `${this.dateStartSeason}`, log_operator: 'AND'},
            {key: 'date', operator: '<', value: `${this.dateEndSeason}`, log_operator: ''}]}).then(res => {
          this.players[i].game_number = res[0].count_game;
        });
      }
    }
  }

  public async onGetStats(id: number): Promise<any> {
    this.players = await this.db.getAll('players', 'name');
    const statsNames: string[] = ['pa', 'run', 'rbi',
      'bb', 'hbp', 'one_b', 'two_b', 'three_b', 'hr', 'so', 'go', 'fo', 'ro'];
    let reqSUM = '';

    for (const name of statsNames) {
      // reqSUM += `SUM(stats.${name}) AS ${name}, `;
      reqSUM += `SUM(stats.${name}) AS ${name}, `; // Пепечисление SELECT из таблицы stats
    }

    reqSUM = reqSUM.slice(0, reqSUM.length - 2);
    let selectPartRequest = '';

    // tslint:disable-next-line:no-conditional-assignment use-isnan
    if (this.yearStat === 'all') {
      // Статистика за все время
      for (const player of this.players) {
        selectPartRequest += `UNION SELECT ${reqSUM}, players.name, players.id, COUNT(*) AS game_number FROM stats
      JOIN players ON stats.player_id = players.id
      JOIN games ON stats.game_id = games.id
      WHERE players.id = ${player.id} `;
      }
      selectPartRequest = selectPartRequest.slice(6);

      this.result = await this.db.getAny({
        selectRequest: `${selectPartRequest}`
      });
    } else {
      // Статистика за конкретный год
      this.dateEndSeason = this.dateStartSeason + 31536000000;
      for (const player of this.players) {
        selectPartRequest += `UNION SELECT ${reqSUM}, players.name, players.id, COUNT(*) AS game_number FROM stats
      JOIN players ON stats.player_id = players.id
      JOIN games ON stats.game_id = games.id
      WHERE players.id = ${player.id} AND games.date > ${this.dateStartSeason} AND games.date < ${this.dateEndSeason} `;
      }
      selectPartRequest = selectPartRequest.slice(6);

      this.result = await this.db.getAny({
        selectRequest: `${selectPartRequest}`
      });
    }

    this.players = this.result;

    return this.result.map(item => {
      for (const key of Object.keys(item)) {
        item[key] = item[key] === null ? 0 : item[key];
      }

      item.ab = item.one_b + item.two_b + item.three_b + item.so + item.go + item.fo;
      item.avg = ((item.one_b + item.two_b + item.three_b) / item.ab) || 0;
      item.avg = Math.round(item.avg * 1000) / 1000;
      item.obp = ((item.one_b + item.two_b + item.three_b + item.bb +
        item.hbp) / (item.ab + item.bb + item.hbp)) || 0;
      item.obp = Math.round(item.obp * 1000) / 1000;
      item.soCoeff = item.so / item.pa || 0;
      item.soCoeff = Math.round(item.soCoeff * 1000) / 1000;
      return item;
    })[0];

  }
}
