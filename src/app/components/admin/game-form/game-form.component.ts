import {Component, OnInit} from '@angular/core';
import {IGame} from '../../../interfaces/game';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatabaseService} from '../../../services/database.service';
import {ITeam} from '../../../interfaces/team';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {
  public dateValue: string = null;
  public games: Array<IGame> = []; // Массив всех игр из БД
  public game: IGame = null; // Переменная для выбранной игры
  public gameId: number = null; // ID выбранной игры
  public gameDate: number = null; // Дата выбранной игры
  public teams: Array<ITeam> = []; // Массив всех команд из БД
  public formGame: FormGroup;
  public visitorInningsControls: FormArray;
  public hostInningsControls: FormArray;
  // tslint:disable-next-line:variable-name
  public visitor_innings = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // tslint:disable-next-line:variable-name
  public host_innings = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // tslint:disable-next-line:variable-name
  public visitor_sum_runs = 0;
  // tslint:disable-next-line:variable-name
  public host_sum_runs = 0;
  public teamVisitor: ITeam = null;
  public teamHost: ITeam = null;
  public teamIdHost: number = null;
  public teamIdVisitor: number = null;


  constructor(
    private db: DatabaseService,
    private fm: FormBuilder
  ) {
  }

  ngOnInit(): void {

    this.formGame = this.fm.group({
      name: ['', new Validators()],
      date: [this.gameDate, new Validators()],
      visitor_id: ['', new Validators()],
      host_id: ['', new Validators()],
      visitor_innings: ['', new Validators()],
      host_innings: ['', new Validators()],
      visitor_sum_runs: ['', new Validators()],
      host_sum_runs: ['', new Validators()],
    });
    this.visitorInningsControls = this.fm.array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.hostInningsControls = this.fm.array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.onGetGames();
    this.onGetTeams();
  }

  private onGetTeams(): void {
    this.db.getAll('teams', 'name').then((teams: Array<ITeam>) => {
      if (teams) {
        this.teams = teams;
      } else {
        alert('В базе данных нет информации о командах');
      }
    });
  }

  public onSelectTeam(id: number, teamNumber: number): void {
    this.db.get({table: 'teams', target: [{key: 'id', value: id}]}).then((result: ITeam) => {
        // Если команда (гость)
        if (teamNumber === 1) {
          this.teamVisitor = result[0];
          this.teamIdVisitor = id;
        } else {
          // Иначе команда (хозяин)
          this.teamHost = result[0];
          this.teamIdHost = id;
        }
      });
  }

  public onTakeDate(date: any): void {
    this.gameDate = date;
  }


  private onSetGame(): void {
    this.formGame.setValue({
      name: this.game.name,
      date: this.game.date,
      visitor_id: this.game.visitor_id,
      host_id: this.game.host_id,
      visitor_innings: this.visitor_innings,
      host_innings: this.host_innings,
      visitor_sum_runs: this.game.visitor_sum_runs,
      host_sum_runs: this.game.host_sum_runs
    });
  }


  public onGetGames(): void {
    this.db.getAll('games', 'date').then((games: Array<IGame>) => {
      this.games = games;
      this.games.forEach(item => item.date = this.onRebuildDate(item.date));
    });
  }

  public async onSelectGame(id: number): Promise<void> {
    this.gameId = Number(id);
    if (this.gameId === 0) {
      this.game = this.onGetGameModel();
      this.teamVisitor = this.onGetTeamModel();
      this.teamHost = this.onGetTeamModel();
      this.visitorInningsControls = this.fm.array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      this.hostInningsControls = this.fm.array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      this.onSetGame();
    } else {
      let result = await this.db.get({table: 'games', target: [{key: 'id', value: id}]});
      this.game = result[0];
      this.dateValue = this.onRebuildDate(result[0].date);
      result = await this.db.get({table: 'teams', target: [{key: 'id', value: this.game.visitor_id}]});
      this.teamVisitor = result[0];
      this.visitor_innings = ('' + this.game.visitor_innings).split('/').map(Number); // парсинг числа в массив (Гости)
      this.visitorInningsControls = this.fm.array(this.visitor_innings);
      result = await this.db.get({table: 'teams', target: [{key: 'id', value: this.game.host_id}]});
      this.teamHost = result[0];
      this.host_innings = ('' + this.game.host_innings).split('/').map(Number); // парсинг числа в массив (Гости)
      this.hostInningsControls = this.fm.array(this.host_innings);
      this.onSetGame();
    }
  }


  private onRebuildDate(value: string): string { // 13-тизначный формат -> DD.MM.YYYY
    return new Date(Number(value)).toLocaleString().split(',')[0];
  }

  public async onSaveGame(): Promise<void> {
    // tslint:disable-next-line:variable-name
    const _confirm: boolean = await confirm('Сохранить изменения?');
    if (_confirm) {
      this.formGame.value.date = this.gameDate;
      const result: IGame = this.game;
      result.name = this.formGame.value.name;
      result.date = this.formGame.value.date;
      result.visitor_id = this.teamVisitor.id;
      result.visitor_innings = this.visitorInningsControls.getRawValue().join('/');
      result.visitor_sum_runs = this.formGame.value.visitor_sum_runs;
      result.host_id = this.teamHost.id;
      result.host_innings = this.hostInningsControls.getRawValue().join('/');
      result.host_sum_runs = this.formGame.value.host_sum_runs;

      if (this.gameId === 0) {
        this.db.save('games', result).then(response => {
          if (response) {
            this.onGetGames();
          }
          this.game = null;
          this.onGetGames();
          console.log(response);
        });
      } else {
        this.db.update('games', this.gameId, result, 'id').then(response => {
          if (response) {
            this.onGetGames();
          }
          this.game = null;
          console.log(response);
        });
      }
    }

  }

  public async onDeleteGame(id: number): Promise<void> {
    // tslint:disable-next-line:variable-name
    const _confirm: boolean = await confirm('Вы действительно хотите удалить игру?');

    if (_confirm) {
      this.db.delete('games', id, 'id').then(result => {
        if (result) {
          this.onGetGames();
        }
        this.game = null;
        console.log(result);
      });
    }
  }


  private onGetGameModel(): IGame {
    return {
      name: '',
      date: '',
      visitor_id: 0,
      host_id: 0,
      visitor_innings: '',
      host_innings: '',
      visitor_sum_runs: 0,
      host_sum_runs: 0
    } as IGame;
  }

  private onGetTeamModel(): ITeam {
    return {
      id: 0,
      name: ''
    } as ITeam;
  }

}
