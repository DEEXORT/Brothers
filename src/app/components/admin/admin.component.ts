import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';


@Component({
  selector: 'app-players',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public authAdmin = false;

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    this.onCheckAdmnin();
  }

  public onCheckAdmnin(): void {
    const getAuth = localStorage.getItem('auth');
    if (getAuth === 'user_Администратор') {
      this.authAdmin = true;
    }
  }
}
