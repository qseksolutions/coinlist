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
  coinlistAPI: any = myGlobals.coinlistAPI;

  constructor(private http: Http) { }

  getCoinCount() {
    const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=25000';
    return this.http.get(url)
      .map((response: Response) => response.json());
  }

  getCoinList(start, limit) {
    const startdata = start;
    const limitdata = limit;
    const url = 'https://api.coinmarketcap.com/v1/ticker/?start=' + startdata + '&limit=' + limitdata;
    return this.http.get(url)
    .map((response: Response) => response.json());
  }
  getList() {
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    /* const form = new URLSearchParams();
    form.append('email', login.email);
    form.append('password', login.password); */

    return this.http.get(this.api_url + this.coinlistAPI, options)
      .map((response: Response) => response.json());
  }

  getSingleCoin(coin) {
    const coinid = coin;
    const url = 'https://api.coinmarketcap.com/v1/ticker/' + coinid + '/';
    return this.http.get(url)
      .map((response: Response) => response.json());
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

    /* const url = 'https://graphs.coinmarketcap.com/currencies/' + coinid + '/';
    return this.http.get(url)
      .map((response: Response) => response); */
    return this.http.post('http://localhost/api.qsek.com/api/v1/getcoindata', form, options)
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
    form.append('usertype', '0');

    return this.http.post(this.api_url + this.registerAPI, form, options)
      .map((response: Response) => response.json());
  }


}
