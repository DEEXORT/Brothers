import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {IAuth} from '../../interfaces/auth';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public result: any;

  constructor(
    private db: DatabaseService
  ) { }

  ngOnInit(): void {
    this.db.get({table: 'users', select: '*'}).then(r =>
      {this.result = r[0].role; }
    );
  }

}
