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
  public model: any;
  public modelcur: any;
  public modeldate: any;

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
    if (this.loginData == null) {
      window.location.href = this.urlString;
    }
  }

  ngOnInit() {
    this.coinservice.portfoliolist().subscribe(resData => {
      if (resData.status === true) {
        console.log(resData);
        this.portfoliolist = resData.data;
      }
    });
    this.coinservice.getallcoin('').subscribe(resData => {
      if (resData.status === true) {
        this.allcoin = resData.data;
      }
    });
    this.coinservice.getallcurrencylist().subscribe(resData => {
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

  onSubmitAddtransaction(trans) {
    this.coinservice.addtrade(trans).subscribe(resData => {
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
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
        return event.target.src = 'assets/currency-50/not-found-25.png';
      }
    });
  }

}
