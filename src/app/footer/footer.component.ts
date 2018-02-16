import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [CoinService],
})
export class FooterComponent implements OnInit {

  public basecurr: any = myGlobals.basecurr;
  public base_sing: any = myGlobals.base_sing;
  public urlString: any = myGlobals.base_url;
  public coincount: any;
  public totalcoin: any;
  public totalmarket: any = 0;
  public totaltrade: any = 0;

  constructor(private coinservice: CoinService, private router: Router, private http: Http) {
  }

  ngOnInit() {
    this.coinservice.getCoinCount().subscribe(responceData => {
      if (responceData.status === true) {
        this.totalmarket = responceData.data['totalmarketcap_' + this.basecurr];
        this.totaltrade = responceData.data['totalvolume_' + this.basecurr];
        const total = responceData.data.totalcoins / 50;
        this.coincount = Math.ceil(total);
        this.totalcoin = responceData.data.totalcoins;
      } else {
        this.totalmarket = 0;
        this.totaltrade = 0;
        this.coincount = 0;
        this.totalcoin = 0;
      }
    });
  }

}
