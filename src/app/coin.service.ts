import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as myGlobals from './global';
import 'rxjs/add/operator/map';
import { URLSearchParams } from '@angular/http';
import { token } from './global';

@Injectable()
export class CoinService {

  api_url: any = myGlobals.api_url;

  loginAPI: any = myGlobals.loginAPI;
  registerAPI: any = myGlobals.registerAPI;
  userbysocialAPI: any = myGlobals.userbysocialAPI;
  addtradeAPI: any = myGlobals.addtradeAPI;
  updatetradeAPI: any = myGlobals.updatetradeAPI;
  removetradeAPI: any = myGlobals.removetradeAPI;
  forgotpasswordAPI: any = myGlobals.forgotpasswordAPI;
  profileupdateAPI: any = myGlobals.profileupdateAPI;
  changepasswordAPI: any = myGlobals.changepasswordAPI;
  addcontactusAPI: any = myGlobals.addcontactusAPI;

  maincurrencylistAPI: any = myGlobals.maincurrencylistAPI;
  subcurrencylistAPI: any = myGlobals.subcurrencylistAPI;
  currencylistAPI: any = myGlobals.currencylistAPI;
  coinlistAPI: any = myGlobals.coinlistAPI;
  totalcoinAPI: any = myGlobals.totalcoinAPI;
  singlecoinAPI: any = myGlobals.singlecoinAPI;
  followlistAPI: any = myGlobals.followlistAPI;
  getallcoinlistAPI: any = myGlobals.getallcoinlistAPI;
  portfoliolistAPI: any = myGlobals.portfoliolistAPI;
  profitlosslistAPI: any = myGlobals.profitlosslistAPI;
  categorylistAPI: any = myGlobals.categorylistAPI;
  supportlistAPI: any = myGlobals.supportlistAPI;
  getprofileupdatedataAPI: any = myGlobals.getprofileupdatedataAPI;
  getselectcoinpriceAPI: any = myGlobals.getselectcoinpriceAPI;
  getsingleseometaAPI: any = myGlobals.getsingleseometaAPI;
  gettestseometaAPI: any = myGlobals.gettestseometaAPI;
  gettradesingledataAPI: any = myGlobals.gettradesingledataAPI;
  getadvertiseforpageAPI: any = myGlobals.getadvertiseforpageAPI;

  cointrackbyuserAPI: any = myGlobals.cointrackbyuserAPI;

  userid: any = localStorage.getItem('id');
  basecur: any = localStorage.getItem('base');
  user_base: any = localStorage.getItem('user_base');
  base_sing: any = localStorage.getItem('base_sing');
  useremail: any = localStorage.getItem('email');
  token: any = localStorage.getItem('token');

  coindate: any;

  constructor(private http: Http) {
    if (this.basecur == null) {
      localStorage.setItem('base', 'USD');
      localStorage.setItem('user_base', 'USD');
      localStorage.setItem('base_sing', '$');
      this.basecur = 'USD';
      this.user_base = 'USD';
    }
    if (this.token == null) {
      this.token = '';
    }
  }

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
    form.append('token', this.token);

    return this.http.post(this.api_url + this.addtradeAPI, form, options)
      .map((response: Response) => response.json());
  }

  updatetrade(trans) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });
    console.log(trans);
    const fcoin = trans.coin;
    const tcoin = fcoin.split('(');
    const lcoin = tcoin[1].split(')');
    trans.coin = lcoin[0];

    const form = new URLSearchParams();
    form.append('port_id', trans.port_id);
    form.append('userid', this.userid);
    form.append('coin_name', tcoin[0]);
    form.append('buycoin', lcoin[0]);
    form.append('buyamount', trans.amount);
    form.append('bcurrency', trans.curr);
    form.append('bcprice', trans.rate);
    form.append('dcurrency', this.user_base);
    form.append('bc_sign', trans.curr_sign);
    form.append('tdate', trans.date);
    form.append('token', this.token);

    return this.http.post(this.api_url + this.updatetradeAPI, form, options)
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

  forgotpassword(email) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('email', email);

    return this.http.post(this.api_url + this.forgotpasswordAPI, form, options)
      .map((response: Response) => response.json());
  }

  profileupdate(profile) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('id', this.userid);
    form.append('name', profile.uname);
    if (profile.b_curr !== '') {
      form.append('d_currency', profile.b_curr.currency_symbol);
      form.append('user_base', this.user_base);
      localStorage.setItem('user_base', profile.b_curr.currency_symbol);
    } else {
      form.append('d_currency', '');
    }
    form.append('token', this.token);

    return this.http.post(this.api_url + this.profileupdateAPI, form, options)
      .map((response: Response) => response.json());
  }

  passwordchange(password) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('id', this.userid);
    form.append('old_pass', password.old_pass);
    form.append('password', password.new_pass);
    form.append('token', this.token);

    return this.http.post(this.api_url + this.changepasswordAPI, form, options)
      .map((response: Response) => response.json());
  }

  addcontactus(contact, image) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('name', contact.cname);
    form.append('email', contact.cemail);
    form.append('subject', contact.subject);
    form.append('image', image);
    form.append('message', contact.message);

    return this.http.post(this.api_url + this.addcontactusAPI, form, options)
      .map((response: Response) => response.json());
  }

  getmaincurrencylist(curr) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    if (curr !== '') {
      return this.http.get(this.api_url + this.maincurrencylistAPI + '/?curr=' + curr, options)
        .map((response: Response) => response.json());
    } else {
      return this.http.get(this.api_url + this.maincurrencylistAPI, options)
        .map((response: Response) => response.json());
    }

  }

  getsubcurrencylist(curr) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    if (curr !== '') {
      return this.http.get(this.api_url + this.subcurrencylistAPI + '/?curr=' + curr, options)
        .map((response: Response) => response.json());
    } else {
      return this.http.get(this.api_url + this.subcurrencylistAPI, options)
        .map((response: Response) => response.json());
    }
  }

  getallcurrencylist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.api_url + this.currencylistAPI, options)
      .map((response: Response) => response.json());
  }

  getCoinList(start, limit, column, order) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const startdata = start;
    const limitdata = limit;

    if (this.userid != null) {
      const currentuser = this.userid;
      // tslint:disable-next-line:max-line-length
      return this.http.get(this.api_url + this.coinlistAPI + '?limit= ' + limitdata + ' &start=' + startdata + '&userid=' + currentuser + '&base=' + this.basecur + '&sorton=' + column + ' &sortby=' + order, options)
        .map((response: Response) => response.json());
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.get(this.api_url + this.coinlistAPI + '?limit= ' + limitdata + ' &start=' + startdata + '&base=' + this.basecur + '&sorton=' + column + ' &sortby=' + order, options)
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
    form.append('token', this.token);

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
    form.append('bcurrency', this.basecur);
    form.append('dcurrency', this.user_base);
    form.append('token', this.token);

    return this.http.post(this.api_url + this.portfoliolistAPI, form, options)
      .map((response: Response) => response.json());
  }

  profitlosslist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('userid', this.userid);
    form.append('bcurrency', this.basecur);
    form.append('dcurrency', this.user_base);
    form.append('token', this.token);

    return this.http.post(this.api_url + this.profitlosslistAPI, form, options)
      .map((response: Response) => response.json());
  }

  categorylist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.api_url + this.categorylistAPI, options)
      .map((response: Response) => response.json());
  }

  questionlist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.api_url + this.supportlistAPI, options)
      .map((response: Response) => response.json());
  }

  getprofileupdatedata() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('email', this.useremail);
    form.append('token', this.token);

    return this.http.post(this.api_url + this.getprofileupdatedataAPI, form, options)
      .map((response: Response) => response.json());
  }

  getsingleseometa(url) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('url', url);

    return this.http.post(this.api_url + this.getsingleseometaAPI, form, options)
      .map((response: Response) => response.json());
  }

  gettestseometa(url) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('url', url);

    return this.http.post(this.api_url + this.gettestseometaAPI, form, options)
     .map((response: Response) => response.json());
    /* return this.http.post(this.api_url + this.getsingleseometaAPI, form, options)
      .map((response: Response) => response.json()); */
  }

  gettradesingledata(id) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('port_id', id);

    return this.http.post(this.api_url + this.gettradesingledataAPI, form, options)
      .map((response: Response) => response.json());
  }

  getadvertiseforpage(side) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('side', side);

    return this.http.post(this.api_url + this.getadvertiseforpageAPI, form, options)
      .map((response: Response) => response.json());
  }

  /* getcoinprice(trans) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('currency', trans.curr.currency_symbol);
    form.append('coin', trans.coin.id);
    form.append('totalcoin', trans.amount);
    if (trans.date.day < 10) {
      trans.date.day = '0' + trans.date.day;
    }
    if (trans.date.month < 10) {
      trans.date.month = '0' + trans.date.month;
    }
    form.append('currdate', trans.date.year + '-' + trans.date.month + '-' + trans.date.day);
    const newDate = trans.date.year + '/' + trans.date.month + '/' + trans.date.day;
    this.coindate = new Date(newDate).getTime();
    form.append('coindate', this.coindate);

    return this.http.post(this.api_url + this.getselectcoinpriceAPI, form, options)
      .map((response: Response) => response.json());
  } */

  getcoinprice(trans) {

    if (trans.port_id === '') {
      const newDate = trans.date.year + '/' + trans.date.month + '/' + trans.date.day;
      this.coindate = new Date(newDate).getTime();
      this.coindate = this.coindate / 1000;

      // tslint:disable-next-line:max-line-length
      return this.http.get('https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + trans.coin.symbol + '&tsyms=' + trans.curr.currency_symbol + '&ts=' + this.coindate)
        .map((response: Response) => response.json());
    } else {
      const tdate = trans.date;
      const newDate = tdate.replace(/-/g, '/');
      this.coindate = new Date(newDate).getTime();
      this.coindate = this.coindate / 1000;

      // tslint:disable-next-line:max-line-length
      return this.http.get('https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + trans.coin + '&tsyms=' + trans.curr + '&ts=' + this.coindate)
        .map((response: Response) => response.json());
    }

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
    form.append('token', this.token);

    return this.http.post(this.api_url + this.cointrackbyuserAPI, form, options)
      .map((response: Response) => response.json());
  }

}
