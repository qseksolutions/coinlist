import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as myGlobals from './global';
import 'rxjs/add/operator/map';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class CoinService {

  api_url: any = myGlobals.api_url;

  loginAPI: any = myGlobals.loginAPI;
  registerAPI: any = myGlobals.registerAPI;
  userbysocialAPI: any = myGlobals.userbysocialAPI;
  addtradeAPI: any = myGlobals.addtradeAPI;
  removetradeAPI: any = myGlobals.removetradeAPI;

  currencylistAPI: any = myGlobals.currencylistAPI;
  coinlistAPI: any = myGlobals.coinlistAPI;
  totalcoinAPI: any = myGlobals.totalcoinAPI;
  singlecoinAPI: any = myGlobals.singlecoinAPI;
  followlistAPI: any = myGlobals.followlistAPI;
  getallcoinlistAPI: any = myGlobals.getallcoinlistAPI;
  portfoliolistAPI: any = myGlobals.portfoliolistAPI;

  cointrackbyuserAPI: any = myGlobals.cointrackbyuserAPI;

  userid: any = myGlobals.userid;
  basecur: any = localStorage.getItem('base');
  user_base: any = localStorage.getItem('user_base');
  base_sing: any = localStorage.getItem('base_sing');

  constructor(private http: Http) { }

  loginuserdata(login) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('email', login.email);
    form.append('password', login.password);

    return this.http.post(this.api_url + this.loginAPI, form, options)
      .map((response: Response) => response.json());
  }

  newuserregister(register) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('name', register.username);
    form.append('email', register.useremail);
    form.append('password', register.userpass);
    form.append('usertype', '1');

    return this.http.post(this.api_url + this.registerAPI, form, options)
      .map((response: Response) => response.json());
  }

  sociallogin(social) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('name', social.name);
    form.append('email', social.email);
    form.append('password', social.id);
    form.append('photo', social.photoUrl);
    if (social.provider === 'GOOGLE') {
      form.append('usertype', '3');
    } else if (social.provider === 'FACEBOOK') {
      form.append('usertype', '2');
    }

    return this.http.post(this.api_url + this.userbysocialAPI, form, options)
      .map((response: Response) => response.json());
  }

  addtrade(trans) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('userid', this.userid);
    form.append('coin_name', trans.coin.name);
    form.append('buycoin', trans.coin.symbol);
    form.append('buyamount', trans.amount);
    form.append('bcurrency', trans.curr.currency_symbol);
    form.append('bcprice', trans.rate);
    form.append('dcurrency', this.user_base);
    form.append('bc_sign', trans.curr.currency_sign);
    if (trans.date.day < 10) {
      trans.date.day = '0' + trans.date.day;
    }
    if (trans.date.month < 10) {
      trans.date.month = '0' + trans.date.month;
    }
    form.append('tdate', trans.date.year + '-' + trans.date.month + '-' + trans.date.day);

    return this.http.post(this.api_url + this.addtradeAPI, form, options)
      .map((response: Response) => response.json());
  }

  removetrade(tradeid) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('userid', this.userid);
    form.append('trade_id', tradeid);

    return this.http.post(this.api_url + this.removetradeAPI, form, options)
      .map((response: Response) => response.json());
  }

  getallcurrencylist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.api_url + this.currencylistAPI, options)
      .map((response: Response) => response.json());
  }

  getCoinList(start, limit) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const startdata = start;
    const limitdata = limit;

    if (this.userid != null) {
      const currentuser = this.userid;
      // tslint:disable-next-line:max-line-length
      return this.http.get(this.api_url + this.coinlistAPI + '?limit= ' + limitdata + ' &start=' + startdata + '&userid=' + currentuser + '&base=' + this.basecur, options)
        .map((response: Response) => response.json());
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.get(this.api_url + this.coinlistAPI + '?limit= ' + limitdata + ' &start=' + startdata + '&base=' + this.basecur, options)
        .map((response: Response) => response.json());
    }
  }

  getCoinCount() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.api_url + this.totalcoinAPI + '/?base=' + this.basecur, options)
      .map((response: Response) => response.json());
  }

  getSingleCoin(coin) {
    const coinid = coin;
    /* const url = 'https://api.coinmarketcap.com/v1/ticker/' + coinid + '/';
    return this.http.get(url)
      .map((response: Response) => response.json()); */

    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    if (this.userid != null) {
      return this.http.get(this.api_url + this.singlecoinAPI + '/' + coinid + '/?userid=' + this.userid + '&base=' + this.basecur, options)
        .map((response: Response) => response.json());
    } else {
      return this.http.get(this.api_url + this.singlecoinAPI + '/' + coinid + '/?base=' + this.basecur, options)
        .map((response: Response) => response.json());
    }
  }

  getGraphData(period, coin) {
    const coinid = coin;

    const headers = new Headers({ 'Content-Type': undefined, 'X-API-KEY': '94ef-bc07-bf47-4ebe-9645-3f89-c464-681d' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('coin', coinid);

    // tslint:disable-next-line:triple-equals
    if (period != '') {
      form.append('period', period);
    } else {
      form.append('period', period);
    }

    return this.http.post('https://qseksolutions.com/api.qsek.com/api/V1/getcoindata', form, options)
      .map((response: Response) => response.json());
  }

  followlist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('userid', this.userid);
    form.append('base', this.basecur);

    return this.http.post(this.api_url + this.followlistAPI, form, options)
      .map((response: Response) => response.json());
  }

  getallcoin(term) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    if (term !== '') {
      return this.http.get(this.api_url + this.getallcoinlistAPI + '/?coin=' + term, options)
        .map((response: Response) => response.json());
    } else {
      return this.http.get(this.api_url + this.getallcoinlistAPI, options)
        .map((response: Response) => response.json());
    }

  }

  portfoliolist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('userid', this.userid);
    form.append('dcurrency', this.basecur);
    form.append('odcurrency', this.user_base);

    return this.http.post(this.api_url + this.portfoliolistAPI, form, options)
      .map((response: Response) => response.json());
  }

  cointrackbyuser(followstatus, coin_id, name) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('coinid', coin_id);
    form.append('userid', this.userid);
    form.append('coinname', name);
    if (followstatus === 1) {
      form.append('status', '0');
    } else {
      form.append('status', '1');
    }

    return this.http.post(this.api_url + this.cointrackbyuserAPI, form, options)
      .map((response: Response) => response.json());
  }

}
