import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private db: DatabaseService
  ) {

  }


  ngOnInit(): void {
  }

}
