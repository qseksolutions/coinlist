import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [CoinService],
})
export class HomeComponent implements OnInit {

  private toasterService: ToasterService;
  public toasterconfig: ToasterConfig =
  new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: false,
    timeout: 2000
  });

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
  public loginData: any = myGlobals.login_ses;
  public userid: any = myGlobals.userid;
  interval: any;
  selectedIndex: any;
  perioddata: any;
  login_ses: any =  0;

  constructor(private coinservice: CoinService, private router: Router, private http: Http, toasterService: ToasterService) {
    this.toasterService = toasterService;

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
      this.selectedIndex = 6;
      this.perioddata = '';
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
    }
    localStorage.setItem('period', period);
  }

  ngOnInit() {
    this.realtimetabledata(this.perioddata);
  }

  realtimetabledata(period) {
    localStorage.setItem('period', period);
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
    } else {
      this.start = 0;
      this.page = 1;
    }

    this.limit = 50;

    this.coinservice.getCoinList(this.start, this.limit).subscribe(resData => {
    if (resData.data.length > 0) {
        this.coins = resData.data;
      }
    });
    this.coinservice.getCoinCount().subscribe(responceData => {
      if (responceData.status === true) {
        this.totalmarket = responceData.data.totalmarketcap;
        this.totaltrade = responceData.data.totalvolume;
        const total = responceData.data.totalcoins / 50;
        this.coincount = Math.ceil(total);
        this.totalcoin = responceData.data.totalcoins;
      } else {
        this.totalmarket = 0;
        this.totaltrade = 0;
        this.totalcoin = 0;
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

  errorHandler(event, name) {
    const imgurl = 'assets/currency-25/' + name.toLowerCase() + '.png';
    this.isImage(imgurl).then(function (test) {
      // tslint:disable-next-line:triple-equals
      if (test == true) {
        return event.target.src = imgurl;
      } else {
        return event.target.src = 'assets/currency-25/not-found-25.png';
      }
    });
  }

  followcoin(coin) {
    this.coinservice.cointrackbyuser(coin.followstatus, coin.coin_id, coin.name).subscribe(resData => {
      if (resData.status === true) {
        if (coin.followstatus === 1) {
          coin.followstatus = 0;
        } else {
          coin.followstatus = 1;
        }
        this.toasterService.pop('success', 'Success', resData.message);
      } else {
        this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
      }
    });
  }
}
