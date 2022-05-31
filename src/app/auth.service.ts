import { Injectable } from '@angular/core';
import {setting} from './consts/settings';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = setting.connect + '/api';
  token;

  constructor(private http: HttpClient, private router: Router) { }

  // tslint:disable-next-line:typedef
  login(login: string, password: string){
    this.http.post(this.url + '/auth', {login, password})
      .subscribe((resp: any) => {
        this.router.navigate(['admin']).then(r => console.log(r));
        localStorage.setItem('token', resp.token);
      });

  }

  // tslint:disable-next-line:typedef
  logout(){
    localStorage.removeItem('token');
  }

  public get logIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }
}
