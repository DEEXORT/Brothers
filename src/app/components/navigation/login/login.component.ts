import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;

  constructor(
    private db: DatabaseService,
    private fm: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.formLogin = this.fm.group({
      login: ['', new Validators()],
      password: ['', new Validators()],
    });
  }

  public async onLogin(): Promise<void> {
    this.authService.login(this.formLogin.value.login, this.formLogin.value.password);
    window.location.reload();
  }
}
