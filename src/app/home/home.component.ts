import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { Title, Meta } from '@angular/platform-browser';

declare var $;

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
  public basecurr: any = myGlobals.basecurr;
  public base_sing: any = myGlobals.base_sing;
  sorton: any;
  sortby: any;
  interval: any;
  selectedIndex: any;
  perioddata: any;
  login_ses: any =  0;

  // tslint:disable-next-line:max-line-length
  constructor(private coinservice: CoinService, private router: Router, private http: Http, toasterService: ToasterService, private title: Title, private meta: Meta ) {
    this.toasterService = toasterService;
    this.sorton = localStorage.getItem('sorton');
    this.sortby = localStorage.getItem('sortby');
    /* alert(this.sorton);
    alert(this.sortby); */

    if (this.sorton === null || this.sorton === 'null') {
      localStorage.setItem('sorton', 'rank');
      this.sorton = localStorage.getItem('sorton');
    }
    if (this.sortby === null || this.sortby === 'null') {
      localStorage.setItem('sortby', 'asc');
      this.sortby = localStorage.getItem('sortby');
    }

    if (this.basecurr == null) {
      localStorage.setItem('base', 'USD');
      localStorage.setItem('base_sing', '$');
      this.basecurr = 'USD';
      this.base_sing = '$';
    } else {
      localStorage.setItem('base', this.basecurr);
      localStorage.setItem('base_sing', this.base_sing);
    }

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

  orderingColumn(column, order) {
    this.sorton = localStorage.getItem('sorton');
    this.sortby = localStorage.getItem('sortby');
    /* alert(this.sorton + ' -> ' + column);
    alert(typeof (this.sorton) + ' -> ' + typeof(column));
    alert(this.sortby + ' -> ' + order); */
    if (this.sorton === column || parseInt(this.sorton, 0) === column) {
      if (this.sortby === 'asc') {
        localStorage.setItem('sortby', 'desc');
        // this.sortby = localStorage.getItem('sortby');
        // alert('if ' + this.sortby);
      } else {
        localStorage.setItem('sortby', 'asc');
        // alert('else ' + this.sortby);
      }
    } else {
      localStorage.setItem('sorton', column);
      localStorage.setItem('sortby', order);
    }
    location.reload();
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
    const curl = window.location.href;
    this.coinservice.gettestseometa(curl).subscribe(resData => {
      if (resData.status === true) {
        // this.title.setTitle(resData.data.title + ' | Coinlisting - Cryptocurrency prices');
        this.meta.addTag({ name: 'description', content: resData.data.description });
        this.meta.addTag({ name: 'keywords', content: resData.data.keywords });
        this.meta.addTag({ name: 'author', content: 'coinlisting' });
        this.meta.addTag({ name: 'robots', content: resData.data.robots });
        this.meta.addTag({ name: 'title', content: ' www.coinlisting.io' });
      }
    });
    this.realtimetabledata(this.perioddata, this.sorton, this.sortby);
  }

  realtimetabledata(period, column, order) {
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
        // tslint:disable-next-line:triple-equals
        } else if (this.page['1'] == 0) {
          window.location.href = this.urlString + '?page=1';
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

    this.coinservice.getCoinList(this.start, this.limit, column, order).subscribe(resData => {
      if (resData.data.length > 0) {
        this.coins = resData.data;
      }
    });
    this.coinservice.getCoinCount().subscribe(responceData => {
      if (responceData.status === true) {
        this.totalmarket = responceData.data['totalmarketcap_' + this.basecurr];
        this.totaltrade = responceData.data['totalvolume_' + this.basecurr];
        const total = responceData.data.totalcoins / 50;
        this.coincount = Math.ceil(total);
        this.totalcoin = responceData.data.totalcoins;
        if (this.page > this.coincount) {
          window.location.href = this.urlString + '?page=' + this.coincount;
        }
      } else {
        this.totalmarket = 0;
        this.totaltrade = 0;
        this.coincount = 0;
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
