import { Component, OnInit } from '@angular/core';
import * as myGlobals from './../global';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  public urlString: any = myGlobals.base_url;

  constructor() {
    const loginData = localStorage.getItem('login_ses');
    if (loginData == null) {
      window.location.href = this.urlString;
    }
  }

  ngOnInit() {
  }

}
