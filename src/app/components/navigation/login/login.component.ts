import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatabaseService} from '../../../services/database.service';
import {Md5} from 'md5-typescript';
import {IPlayer} from '../../../interfaces/player';
import {toBase64String} from '@angular/compiler/src/output/source_map';
import {IAuth} from '../../../interfaces/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  public logInfo: IAuth = null;

  constructor(
    private db: DatabaseService,
    private fm: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formLogin = this.fm.group({
      login: ['', new Validators()],
      password: ['', new Validators()],
    });
  }
  // public onLogin(): void{
  //   const login = this.formLogin.value.login;
  //   const password = this.formLogin.value.password;
  // }

  public async onLogin(): Promise<void> {
    // this.onGetInfoPlayer(this.formLogin.value.login);
    await this.db.login({login: this.formLogin.value.login}).then((result: IPlayer) => {
      this.logInfo = result[0];
    });
    const clientHashPassword = Md5.init(this.formLogin.value.password + this.logInfo.salt);
    if (clientHashPassword === this.logInfo.password) {
      alert('Пароль введен верно');
      localStorage.setItem('auth', `user_${this.logInfo.role}`);
      window.location.reload();
    }
    else {
      alert('Пароль неверный');
    }
  }
}
