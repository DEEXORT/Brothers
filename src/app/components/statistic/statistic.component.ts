import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {IPlayer, IPlayerExt} from '../../interfaces/player';
import {IStat} from '../../interfaces/stats';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {IAccord} from '../../interfaces/accordance';

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
  public ids = '';
  public result: IStat[];
  public statName = {head: 'AVG', body: 'avg'};
  private subscription: Subscription;
  public checkStat = true;
  public prevSelectStat = 'avg';
  // Фильтрация заголовок для мобильного режима
  public statsNamesFilter: Array<IAccord> = [{firstName: 'AVG', secondName: 'avg'}, {firstName: 'OBP', secondName: 'obp'},
    {firstName: 'SO/PA', secondName: 'soCoeff'}, {firstName: 'R', secondName: 'run'}, {firstName: 'RBI', secondName: 'rbi'},
    {firstName: 'BB', secondName: 'bb'}, {firstName: 'HBP', secondName: 'hbp'}, {firstName: '1B', secondName: 'one_b'},
    {firstName: '2B', secondName: 'two_b'}, {firstName: '3B', secondName: 'three_b'}, {firstName: 'HR', secondName: 'hr'},
    {firstName: 'SO', secondName: 'so'}, {firstName: 'GO', secondName: 'go'}, {firstName: 'FO', secondName: 'fo'},
    {firstName: 'RO', secondName: 'ro'}];
  // Заголовки таблицы для полноэкранного режима
  public statsNamesAll: Array<IAccord> = [{firstName: 'G', secondName: 'game_number'}, {firstName: 'PA', secondName: 'pa'},
    {firstName: 'AB', secondName: 'ab'}, {firstName: 'AVG', secondName: 'avg'}, {firstName: 'OBP', secondName: 'obp'},
    {firstName: 'SO/PA', secondName: 'soCoeff'}, {firstName: 'R', secondName: 'run'}, {firstName: 'RBI', secondName: 'rbi'},
    {firstName: 'BB', secondName: 'bb'}, {firstName: 'HBP', secondName: 'hbp'}, {firstName: '1B', secondName: 'one_b'},
    {firstName: '2B', secondName: 'two_b'}, {firstName: '3B', secondName: 'three_b'}, {firstName: 'HR', secondName: 'hr'},
    {firstName: 'SO', secondName: 'so'}, {firstName: 'GO', secondName: 'go'}, {firstName: 'FO', secondName: 'fo'},
    {firstName: 'RO', secondName: 'ro'}];

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
      this.onGetStats();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public async sortStat(field, reverse): Promise<any> {
    if (this.prevSelectStat !== field){
      reverse = true;
      this.checkStat = reverse;
      this.prevSelectStat = field;
    } else {
      reverse = !reverse;
      this.checkStat = reverse;
      this.prevSelectStat = field;
    }
    // tslint:disable-next-line:no-shadowed-variable variable-name
    const sort_by = (field, reverse, primer) => {
      const key = primer ?
        // tslint:disable-next-line:only-arrow-functions typedef
        function(x) {
          return primer(x[field]);
        } :
        // tslint:disable-next-line:only-arrow-functions typedef
        function(x) {
          return x[field];
        };

      reverse = !reverse ? 1 : -1;

      // tslint:disable-next-line:only-arrow-functions typedef
      return function(a, b) {
        // @ts-ignore
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      };
    };
    this.players.sort(sort_by(field, reverse, parseFloat));
  }

  public async onGetStats(): Promise<any> {
    this.players = await this.db.getAll('players', 'name');
    const statsNames: string[] = ['pa', 'run', 'rbi',
      'bb', 'hbp', 'one_b', 'two_b', 'three_b', 'hr', 'so', 'go', 'fo', 'ro'];
    let reqSUM = '';

    for (const name of statsNames) {
      // reqSUM += `SUM(stats.${name}) AS ${name}, `;
      reqSUM += `SUM(stats.${name}) AS ${name}, `; // Перечисление SELECT из таблицы stats
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
      selectPartRequest += 'ORDER BY pa DESC';

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
      selectPartRequest += 'ORDER BY pa DESC';

      this.result = await this.db.getAny({
        selectRequest: `${selectPartRequest}`
      });
    }

    this.players = this.result.filter(item => item.id != null); // Удаление лишних строк, полученных из БД

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
