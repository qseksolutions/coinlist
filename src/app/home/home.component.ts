import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [CoinService],
})
export class HomeComponent implements OnInit {

  coins: any = Array();
  public start: any;
  public limit: any;
  abc: any;
  public page: any;
  public coincount: any;
  public totalcoin: any;
  public totalmarket: any = 0;
  public totaltrade: any = 0;
  prepage: any;
  nxtpage: any;
  public graph: any;
  public urlString: any = myGlobals.base_url;
  interval: any;
  selectedIndex: any;
  perioddata: any;

  constructor(private coinservice: CoinService, private router: Router) {
    this.perioddata = localStorage.getItem('period');
    if (this.perioddata === 'hour') {
      this.selectedIndex = 1;
    } else if (this.perioddata === 'day') {
      this.selectedIndex = 2;
    } else if (this.perioddata === 'week') {
      this.selectedIndex = 3;
    } else if (this.perioddata === 'month') {
      this.selectedIndex = 4;
    } else if (this.perioddata === 'year') {
      this.selectedIndex = 5;
    } else {
      this.selectedIndex = 1;
      this.perioddata = 'hour';
    }
    this.prepage = 0;
    this.nxtpage = 2;
  }

  toggleClass(period, index: number) {
    // event.target.classList.toggle('active');
    // tslint:disable-next-line:triple-equals
    if (this.selectedIndex == index) {
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = index;
      this.realtimetabledata(period);
    }
  }

  ngOnInit() {
    this.realtimetabledata(this.perioddata);
  }

  realtimetabledata(period) {
    localStorage.setItem('period', period);
    this.perioddata = localStorage.getItem('period');
    const url = window.location.href;
    if (url.indexOf('=') > 0) {
      const x = url.split('?');
      // tslint:disable-next-line:triple-equals
      if (x[1] != '' || x[1] != undefined) {
        this.page = x[1].split('=');
        // tslint:disable-next-line:triple-equals
        if (this.page[1] != '' && this.page[1] != 0) {
          this.nxtpage = parseInt(this.page[1], 0) + 1;
          this.prepage = parseInt(this.page[1], 0) - 1;
          // tslint:disable-next-line:triple-equals
          this.start = (parseInt(this.page[1], 0) - 1) * 50;
          this.page = this.page[1];
        } else {
          this.start = 0;
          this.page = 1;
        }
      } else {
        this.start = 0;
        this.page = 1;
      }
      // tslint:disable-next-line:triple-equals
    } else {
      this.start = 0;
      this.page = 1;
    }

    this.limit = 50;
    console.log(this.start);

    // tslint:disable-next-line:max-line-length
    this.graph = '00,120,20,60,40,80,60,20,80,80,100,80,120,60,140,100,160,90,180,80,200,110,220,10,240,70,260,100,280,100,300,40,320,0,340,100,360,100,380,120,400,60,420,70,440,80';
    this.coinservice.getCoinCount()
    .subscribe(responceData => {
      if (responceData.length > 0) {
        for (let i = 0; i < responceData.length; i++) {
          // tslint:disable-next-line:triple-equals
          if (responceData[i]['market_cap_usd'] != null && responceData[i]['market_cap_usd'] != undefined) {
            this.totalmarket += parseFloat(responceData[i]['market_cap_usd']);
          }
          // tslint:disable-next-line:triple-equals
          if (responceData[i]['24h_volume_usd'] != null && responceData[i]['24h_volume_usd'] != undefined) {
            this.totaltrade += parseFloat(responceData[i]['24h_volume_usd']);
          }
        }
        const total = responceData.length / 20;
        this.coincount = Math.ceil(total);
        this.totalcoin = responceData.length;
      }
    });
    this.coinservice.getCoinList(this.start, this.limit)
      .subscribe(resData => {
        if (resData.length > 0) {
          for (let i = 0; i < resData.length; i++) {
            // tslint:disable-next-line:triple-equals
            const imgurl = 'assets/currency-svg/' + resData[i]['symbol'].toLowerCase() + '.svg';
            this.isImage(imgurl).then(function (test) {
              // tslint:disable-next-line:triple-equals
              if (test == true) {
                resData[i].imgpath = 'assets/currency-svg/' + resData[i]['symbol'].toLowerCase() + '.svg';
              } else {
                resData[i].imgpath = 'assets/currency-25/' + resData[i]['symbol'].toLowerCase() + '.png';
              }
            });
          }
          setTimeout(() => {
            this.coins = [];
            this.coins = resData;
          }, 500);
        }
      });
  }

  isImage(src) {
    const deferred = defer();
    const image = new Image();
    image.onerror = function () {
      deferred.resolve(false);
    };
    image.onload = function () {
      deferred.resolve(true);
    };
    image.src = src;
    return deferred.promise;
  }

}
