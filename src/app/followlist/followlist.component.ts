import { Component, OnInit } from '@angular/core';
import * as myGlobals from './../global';

@Component({
  selector: 'app-followlist',
  templateUrl: './followlist.component.html',
  styleUrls: ['./followlist.component.css']
})
export class FollowlistComponent implements OnInit {

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
