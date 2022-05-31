import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.onCheckAdmnin();
  }

  public onMainPage(): void {
    this.router.navigate(['/', {id: 1}]).then();
  }


  public get isAdmin(): boolean {
    return JSON.parse(sessionStorage.getItem('user_auth'));
  }

  public onCheckAdmnin(): void {
    const getAuth = localStorage.getItem('auth');
    if (getAuth === 'user_Администратор') {
    }
  }


}
