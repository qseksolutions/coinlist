import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { URLSearchParams } from '@angular/http';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { Title, Meta } from '@angular/platform-browser';

declare var jQuery: any;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [CoinService],
})
export class PortfolioComponent implements OnInit {

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
  new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: false,
    timeout: 2000
  });

  public urlString: any = myGlobals.base_url;
  public loginData: any = myGlobals.login_ses;
  public base_sing: any = myGlobals.base_sing;
  allcoin: any;
  allcurrency: any;
  portfoliolist: any;
  profitlosslist: any;
  public model: any;
  public modelcur: any;
  public modeldate: any;
  totalcost: any = 0;
  value: any = 0;
  overolsum: any = 0;
  overolper: any = 0;

  // tslint:disable-next-line:max-line-length
  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService, private title: Title, private meta: Meta) {
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
    this.toasterService = toasterService;
    if (this.loginData == null) {
      window.location.href = this.urlString;
    }
  }

  ngOnInit() {
    const curl = window.location.href;
    this.coinservice.gettestseometa(curl).subscribe(resData => {
      if (resData.status === true) {
        this.title.setTitle(resData.data.title);
        this.meta.addTag({ name: 'description', content: resData.data.description });
        this.meta.addTag({ name: 'keywords', content: resData.data.keywords });
        this.meta.addTag({ name: 'author', content: 'coinlisting' });
        this.meta.addTag({ name: 'robots', content: resData.data.robots });
        this.meta.addTag({ name: 'title', content: ' www.coinlisting.io' });
      }
    });
    this.coinservice.profitlosslist().subscribe(resData => {
      if (resData.status === true) {
        for (let i = 0; i < resData.data.length; i++) {
          this.totalcost += resData.data[i]['totalcost'];
          this.value += resData.data[i]['current_price'] * resData.data[i]['coin_amount'];
        }
        this.overolsum = this.value;
        this.overolper = (this.value - this.totalcost) / this.totalcost * 100;
        this.profitlosslist = resData.data;
      } else {
        this.profitlosslist = '';
      }
    });
    this.coinservice.portfoliolist().subscribe(resData => {
      if (resData.status === true) {
        this.portfoliolist = resData.data;
      } else {
        this.portfoliolist = '';
      }
    });
    this.coinservice.getallcoin('').subscribe(resData => {
      if (resData.status === true) {
        this.allcoin = resData.data;
      }
    });
    this.coinservice.getmaincurrencylist('').subscribe(resData => {
      if (resData.status === true) {
        this.allcurrency = resData.data;
      }
    });
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : this.allcoin.filter(v => v.id.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  formatter = (x: { name: string, symbol: string }) => x.name + ' (' + x.symbol + ')';

  searchcur = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(termcur => termcur === '' ? []
        : this.allcurrency.filter(v => v.currency_symbol.toLowerCase().indexOf(termcur.toLowerCase()) > -1).slice(0, 10))

  formattercur = (x: { currency_symbol: string }) => x.currency_symbol;
  formattersign = (x: { currency_sign: string }) => x.currency_sign;

  getcoinprice(trans) {
    // tslint:disable-next-line:max-line-length
    trans.port_id = jQuery('#port_id').val();
    if (trans.date !== null && trans.date !== undefined && trans.coin !== undefined && trans.coin !== '' && trans.curr !== undefined && trans.curr !== '' && trans.amount !== '' && trans.port_id === '') {
      this.coinservice.getcoinprice(trans).subscribe(resData => {
        if (resData.Response === 'Error') {
          jQuery('#rate').val('0');
        } else {
          jQuery('#rate').val(resData[trans.coin.symbol][trans.curr.currency_symbol] * trans.amount);
        }
      });
    } else {
      trans.date = jQuery('#tdate').val();
      trans.coin = jQuery('#selectedcoin').val();
      trans.curr = jQuery('#selectedcur').val();
      trans.amount = jQuery('#tamount').val();
      trans.rate = jQuery('#rate').val();
      if (trans.date !== '' && trans.coin !== '' && trans.curr !== '' && trans.amount !== '') {
        const fcoin = trans.coin;
        const tcoin = fcoin.split('(');
        const lcoin = tcoin[1].split(')');
        trans.coin = lcoin[0];

        this.coinservice.getcoinprice(trans).subscribe(resData => {
          if (resData.Response === 'Error') {
            jQuery('#rate').val('0');
          } else {
            jQuery('#rate').val(resData[trans.coin][trans.curr] * trans.amount);
          }
        });
      }
    }
  }

  onSubmitAddtransaction(trans) {
    trans.rate = jQuery('#rate').val();
    trans.port_id = jQuery('#port_id').val();
    if (trans.port_id === '') {
      if (trans.date === undefined || trans.date === null) {
        this.toasterService.pop('error', 'Required', 'Please select date');
      } else if (trans.coin === undefined || trans.coin === '') {
        this.toasterService.pop('error', 'Required', 'Please select coin');
      } else if (trans.curr === undefined || trans.curr === '') {
        this.toasterService.pop('error', 'Required', 'Please select currency');
      } else if (trans.amount === '') {
        this.toasterService.pop('error', 'Required', 'Please enter amount');
      } else if (trans.rate === '') {
        this.toasterService.pop('error', 'Required', 'Please enter rate');
      } else {
        this.coinservice.addtrade(trans).subscribe(resData => {
          if (resData.status === true) {
            this.toasterService.pop('success', 'Success', resData.message);
            this.ngOnInit();
            setTimeout(() => {
              jQuery('#coin_image').attr('src', 'assets/currency-svg/btc.svg');
              jQuery('#curr_image').attr('src', 'assets/currency-symbol/usd.svg');
              jQuery('.form-control').val('');
              jQuery('#newtransaction').modal('hide');
            }, 1000);
          } else {
            this.toasterService.pop('error', 'Error', resData.message);
          }
        });
      }
    } else {
      trans.date = jQuery('#tdate').val();
      trans.coin = jQuery('#selectedcoin').val();
      trans.curr = jQuery('#selectedcur').val();
      trans.amount = jQuery('#tamount').val();
      trans.rate = jQuery('#rate').val();
      trans.curr_sign = jQuery('#selectedcursign').val();
      this.coinservice.updatetrade(trans).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          this.ngOnInit();
          setTimeout(() => {
            jQuery('#coin_image').attr('src', 'assets/currency-svg/btc.svg');
            jQuery('#curr_image').attr('src', 'assets/currency-symbol/usd.svg');
            jQuery('.form-control').val('');
            jQuery('#newtransaction').modal('hide');
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

  traderemove(tradeid) {
    this.coinservice.removetrade(tradeid).subscribe(resData => {
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
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
    const imgurl = 'assets/currency-50/' + name.toLowerCase() + '.png';
    this.isImage(imgurl).then(function (test) {
      // tslint:disable-next-line:triple-equals
      if (test == true) {
        return event.target.src = imgurl;
      } else {
        return event.target.src = 'assets/currency-50/not-found-50.png';
      }
    });
  }

  edittrade(id) {
    this.coinservice.gettradesingledata(id).subscribe(resData => {
      if (resData.status === true) {
        jQuery('#tdate').val(resData.data.transaction_date);
        jQuery('#selectedcoin').val(resData.data.coin_name + ' (' + resData.data.buy_coin + ')');
        const coinimgurl = 'assets/currency-svg/' + resData.data.buy_coin.toLowerCase() + '.svg';
        this.isImage(coinimgurl).then(function (test) {
          if (test === true) {
            jQuery('#coin_image').attr('src', coinimgurl);
          } else {
            jQuery('#coin_image').attr('src', 'assets/currency-50/' + resData.data.buy_coin.toLowerCase() + '.png');
          }
        });
        jQuery('#selectedcur').val(resData.data.b_currency);
        jQuery('#curr_image').attr('src', 'assets/currency-symbol/' + resData.data.b_currency.toLowerCase() + '.svg');
        jQuery('#tamount').val(resData.data.coin_amount);
        jQuery('#rate').val(resData.data.bc_price);
        jQuery('#port_id').val(resData.data.id);
        jQuery('#selectedcursign').val(resData.data.bc_sign);
        jQuery('#newtransaction').modal('toggle');
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

}
