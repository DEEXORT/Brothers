import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // title = 'BSP';
  title = environment.title;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
    console.log(router);
    console.log(activatedRoute);
  }

  ngOnInit(): void {
  }
}
