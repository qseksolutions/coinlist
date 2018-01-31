import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [CoinService],
})
export class PortfolioComponent implements OnInit {

  public urlString: any = myGlobals.base_url;
  public loginData: any = myGlobals.login_ses;
  allcoin: any;
  allcurrency: any;
  public model: any;
  public modelcur: any;

  constructor(private coinservice: CoinService, private router: Router) {
    if (this.loginData == null) {
      window.location.href = this.urlString;
    }
  }

  ngOnInit() {
    this.coinservice.getallcoin('').subscribe(resData => {
      if (resData.status === true) {
        console.log(resData);
        this.allcoin = resData.data;
      }
    });
    this.coinservice.getallcurrencylist().subscribe(resData => {
      if (resData.status === true) {
        console.log(resData);
        this.allcurrency = resData.data;
      }
    });
  }

  /* coinsearch(term: string) {
    if (term === '') {
      return of([]);
    }

    this.coinservice.getallcoin(term).subscribe(resData => {
      this.allcoin = resData.data;
    });
  } */

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : this.allcoin.filter(v => v.id.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  formatter = (x: { name: string, symbol: string }) => x.name + ' (' + x.symbol + ')';

  searchcur = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(termcur => termcur === '' ? []
        : this.allcurrency.filter(v => v.currency_symbol.toLowerCase().indexOf(termcur.toLowerCase()) > -1).slice(0, 10));

  formattercur = (x: { currency_symbol: string }) => x.currency_symbol;

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

}
