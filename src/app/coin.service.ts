import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as myGlobals from './global';
import 'rxjs/add/operator/map';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class CoinService {

  userid: any = myGlobals.userid;
  api_url: any = myGlobals.api_url;
  loginAPI: any = myGlobals.loginAPI;
  registerAPI: any = myGlobals.registerAPI;
  userbysocialAPI: any = myGlobals.userbysocialAPI;
  coinlistAPI: any = myGlobals.coinlistAPI;
  totalcoinAPI: any = myGlobals.totalcoinAPI;
  currencylistAPI: any = myGlobals.currencylistAPI;
  cointrackbyuserAPI: any = myGlobals.cointrackbyuserAPI;
  singlecoinAPI: any = myGlobals.singlecoinAPI;
  followlistAPI: any = myGlobals.followlistAPI;

  constructor(private http: Http) { }

  getCoinCount() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.api_url + this.totalcoinAPI, options)
      .map((response: Response) => response.json());
  }

  /* getCoinList(start, limit) {
    const startdata = start;
    const limitdata = limit;
    const url = 'https://api.coinmarketcap.com/v1/ticker/?start=' + startdata + '&limit=' + limitdata;
    return this.http.get(url)
    .map((response: Response) => response.json());
  } */
  getCoinList(start, limit) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    const startdata = start;
    const limitdata = limit;

    if (this.userid != null) {
      const currentuser = this.userid;
      // tslint:disable-next-line:max-line-length
      return this.http.get(this.api_url + this.coinlistAPI + '?limit= ' + limitdata + ' &start=' + startdata + '&userid=' + currentuser, options)
        .map((response: Response) => response.json());
    } else {
      return this.http.get(this.api_url + this.coinlistAPI + '?limit= ' + limitdata + ' &start=' + startdata, options)
        .map((response: Response) => response.json());
    }
  }

  getallcurrencylist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.api_url + this.currencylistAPI, options)
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
      return this.http.get(this.api_url + this.singlecoinAPI + '/' + coinid + '/?userid=' + this.userid, options)
        .map((response: Response) => response.json());
    } else {
      return this.http.get(this.api_url + this.singlecoinAPI + '/' + coinid, options)
        .map((response: Response) => response.json());
    }
  }

  getGraphData(period, coin) {
    const coinid = coin;

    const headers = new Headers({ 'Content-Type': undefined, 'X-API-KEY': 'HUFIY748F34HF4F984FY438' });
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('coin', coinid);

    // tslint:disable-next-line:triple-equals
    if (period != '') {
      form.append('period', period);
    } else {
      form.append('period', period);
    }

    return this.http.post('http://localhost/api.qsek.com/api/v1/getcoindata', form, options)
    .map((response: Response) => response.json());
  }

  followlist() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('userid', this.userid);

    return this.http.post(this.api_url + this.followlistAPI, form, options)
      .map((response: Response) => response.json());
  }

  loginuserdata(login) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
    const options = new RequestOptions({ headers: headers });

    const form = new URLSearchParams();
    form.append('email', login.email);
    form.append('password', login.password);

    return this.http.post(this.api_url + this.loginAPI, form, options)
      .map((response: Response) => response.json());
  }

  newuserregister(register) {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
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
