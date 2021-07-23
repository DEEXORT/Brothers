import {Component, OnInit} from '@angular/core';
import {IGame} from '../../../interfaces/game';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatabaseService} from '../../../services/database.service';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {
  public dateValue: string = null;
  public games: Array<IGame> = [];
  public game: IGame = null;
  public gameId: number = null;
  public gameDate: number = null;
  public formGame: FormGroup;


  constructor(
    private db: DatabaseService,
    private fm: FormBuilder
  ) {
  }

  ngOnInit(): void {

    this.formGame = this.fm.group({
      name: ['', new Validators()],
      date: [this.gameDate, new Validators()],
      result: ['', new Validators()],
      score: ['', new Validators()]
    });

    this.onGetGames();
  }


  public onTakeDate(date: any): void {
    this.gameDate = date;
  }


  private onSetGame(): void {
    this.formGame.setValue({
      name: this.game.name,
      date: this.game.date,
      score: this.game.score,
      result: this.game.result
    });
  }


  public onGetGames(): void {
    this.db.getAll('games', 'date').then((games: Array<IGame>) => {
      this.games = games;
      this.games.forEach(item => item.date = this.onRebuildDate(item.date));
    });
  }

  public onSelectGame(id: number): void {
    this.gameId = Number(id);
    if (this.gameId === 0) {
      this.game = this.onGetGameModel();
      this.onSetGame();
    } else {
      this.db.get({table: 'games', target: [{key: 'id', value: id}]}).then((result: IGame) => {
        this.game = result[0];
        this.dateValue = this.onRebuildDate(result[0].date);
        this.formGame.setValue({
          name: this.game.name,
          date: this.game.date,
          score: this.game.score,
          result: this.game.result,
        });
      });
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

      if (this.gameId === 0) {
        this.db.save('games', this.formGame.value).then(result => {
          if (result) {
            this.onGetGames();
          }
          this.game = null;
          this.onGetGames();
          console.log(result);
        });
      } else {
        this.db.update('games', this.gameId, this.formGame.value, 'id').then(result => {
          if (result) {
            this.onGetGames();
          }
          this.game = null;
          console.log(result);
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
      score: '',
      result: ''
    } as IGame;
  }


}
