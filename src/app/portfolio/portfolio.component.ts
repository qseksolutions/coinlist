import { Component, OnInit } from '@angular/core';
import * as myGlobals from './../global';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  public urlString: any = myGlobals.base_url;
  public loginData: any = myGlobals.login_ses;

  constructor() {
    if (this.loginData == null) {
      window.location.href = this.urlString;
    }
  }

  ngOnInit() {
  }

}
