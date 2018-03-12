import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { StockChart } from 'angular-highcharts';
import { defer } from 'q';
import { DatePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.css'],
  providers: [CoinService, DatePipe],
})
export class CoinComponent implements OnInit {

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 2000
    });

  chart: StockChart;
  market_cap: any;
  price_usd: any;
  coin: any;
  selectedIndex: any = 6;
  perioddata: any;
  public follow: any;
  public loginData: any = myGlobals.login_ses;
  public userid: any = myGlobals.userid;
  public basecurr: any = myGlobals.basecurr;
  public base_sing: any = myGlobals.base_sing;

  // tslint:disable-next-line:max-line-length
  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService, private http: Http, private titleService: Title, private datePipe: DatePipe, private meta: Meta) {
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
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
    } else if (this.perioddata === 'all') {
      this.selectedIndex = 6;
    } else {
      this.selectedIndex = 1;
      this.perioddata = 'hour';
    }
  }

  toggleClass(period, index: number) {
    // event.target.classList.toggle('active');
    // tslint:disable-next-line:triple-equals
    if (this.selectedIndex == index) {
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = index;
      this.realTimeGraph(period);
    }
  }

  followcoin(coin) {
    this.coinservice.cointrackbyuser(coin.followstatus, coin.coin_id, coin.name).subscribe(resData => {
      if (resData.status === true) {
        if (this.follow === 1) {
          this.follow = 0;
          coin.followstatus = 0;
        } else {
          this.follow = 1;
          coin.followstatus = 1;
        }
        // this.toasterService.pop('success', 'Success', resData.message);
      } else {
        // this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
      }
    });
  }

  realTimeData() {
    const url = window.location.href;
    const coinid = url.split('/');
    this.coinservice.getSingleCoin(coinid[4]).subscribe(resData => {
      if (resData.status === true) {
        const imgurl = 'assets/currency-svg/' + resData.data.symbol.toLowerCase() + '.svg';
        this.isImage(imgurl).then(function (test) {
          // tslint:disable-next-line:triple-equals
          if (test == true) {
            resData.data.imgpath = imgurl;
          } else {
            resData.data.imgpath = 'assets/currency-50/' + resData.data.symbol.toLowerCase() + '.png';
          }
        });
        setTimeout(() => {
          this.follow = resData.data.followstatus;
          this.coin = resData.data;
        }, 100);
      }
    });
  }

  ngOnInit() {
    this.realTimeData();
    this.realTimeGraph(this.perioddata);
    const curl = window.location.href;
    const ccoin = curl.split('/');
    const durl = curl.replace('/' + ccoin[4], '');
    this.coinservice.getSingleCoin(ccoin[4]).subscribe(responce => {
      if (responce.status === true) {
        this.coin = responce.data;
        this.coinservice.gettestseometa(durl).subscribe(resData => {
          if (resData.status === true) {
            const temptitle = resData.data.title;
            const title = temptitle.replace('[COIN]', this.coin.name);
            resData.data.title = title.replace('[COIN_SYMBOL]', this.coin.symbol);
            this.titleService.setTitle(resData.data.title);
            const tempdesc = resData.data.description;
            const desc = tempdesc.replace('[COIN]', this.coin.name);
            resData.data.description = desc.replace('[COIN_SYMBOL]', this.coin.symbol);
            this.meta.addTag({ name: 'description', content: resData.data.description });
            const tempkeyw = resData.data.description;
            const keyw = tempkeyw.replace('[COIN]', this.coin.name);
            resData.data.keywords = keyw.replace('[COIN_SYMBOL]', this.coin.symbol);
            this.meta.addTag({ name: 'keywords', content: resData.data.keywords });
            this.meta.addTag({ name: 'author', content: 'coinlisting' });
            this.meta.addTag({ name: 'robots', content: resData.data.robots });
            this.meta.addTag({ name: 'title', content: 'www.coinlisting.io' });
          }
        });
      }
    });
  }

  realTimeGraph(period) {
    localStorage.setItem('period', period);
    this.perioddata = localStorage.getItem('period');
    const url = window.location.href;
    const coinid = url.split('/');
    this.coinservice.getGraphData(period, coinid[4]).subscribe(response => {
      this.market_cap = response.market_cap;
      this.price_usd = response.price_usd;
        this.chart = new StockChart({
          chart: {
            type: 'spline',
            zoomType: 'x',
            backgroundColor: null,
            renderTo: 'container',
            style: {
                fontFamily: 'Montserrat',
             },
          },
          rangeSelector: {
            enabled: false,
          },
          scrollbar: {
            enabled: false
          },
          tooltip: {
             formatter: function () {
              // tslint:disable-next-line:max-line-length
              return  '<span style="font-size:11px;font-weight:bold;color:#9ca5be;margin-bottom:10px;">' + moment.unix(this.x / 1000).format(' DD MMM, YYYY HH:mm') + '</span><br/><span style=""> $ ' + this.y + '</span>';
            },
            crosshairs: {
              color: 'rgba(61, 51, 121, 1)',
              zIndex: 22,
              dashStyle: 'solid',
              width: 2
            },
            style: {
              color: 'rgba(61, 51, 121, 1)',
              fontSize: '13px',
              textAlign : 'center',
              fontWeight: 'bold',
            },
            backgroundColor: '#FFF',
            borderColor: 'rgba(61, 51, 121, 1)',
            borderRadius: 5,
            borderWidth: 2,
             padding: 10
          },
          xAxis: {
            type: 'datetime',
            inside: true,
            labels: {
              style: {
                color: '#9ca5be',
                fontWeight: '700'
              }
            },
          },
          yAxis: [
            {
              gridLineWidth: 2,
              title: {
                text: 'Price in USD',
                style: {
                  color: '#9ca5be',
                  fontSize: '14px',
                  fontWeight: '700'
                }
              },
              labels: {
                align: 'left',
                format: '${value}',
                style: {
                  color: '#9ca5be',
                  fontWeight: '700'
                }
              },
              opposite: true
            },
          ],
          plotOptions: {
            area: {
              lineWidth: 2,
              marker: {
                enabled: false
              },
              states: {
                hover: {
                  lineWidth: 2
                }
              },
              series: {
                shadow: true
              },
              threshold: null
            }
          },
          credits: {
            enabled: false
          },
          series: [
            {
              color: '#5f53a7',
              name: 'Price in USD',
              data: this.price_usd,
              type: 'area',
              yAxis: 0,
              fillColor: {
                linearGradient: { x1: 0.5, y1: 0, x2: 0.5, y2: 1 },
                stops: [
                  [0, 'rgba(61, 51, 121, 1)'],
                  [0.40, 'rgba(61, 51, 121, 1)'],
                  [1, 'rgba(255,128,51, .5)']
                ]
              },
              // fillOpacity: 0.1
            },
          ],
          navigator: {
            enabled: false
          },
          navigation: {
            buttonOptions: {
              enabled: false
            }
          },
        });
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
