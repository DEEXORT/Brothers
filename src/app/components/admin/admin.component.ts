import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-players',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public authAdmin = false;

  constructor() {
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
