import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { StockChart } from 'angular-highcharts';
import { Title } from '@angular/platform-browser';
import { defer } from 'q';

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.css'],
  providers: [CoinService],
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
  coin: any;
  market_cap: any;
  price_usd: any;
  selectedIndex: any = 6;
  perioddata: any;
  public follow: any;
  public loginData: any = myGlobals.login_ses;
  public userid: any = myGlobals.userid;

  // tslint:disable-next-line:max-line-length
  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService, private http: Http, private titleService: Title) {
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

  ngOnInit() {
    this.realTimeData();
    this.realTimeGraph(this.perioddata);
  }

  realTimeGraph(period) {
    localStorage.setItem('period', period);
    this.perioddata = localStorage.getItem('period');
    const url = window.location.href;
    const coinid = url.split('/');
    this.coinservice.getGraphData(period, coinid[4])
    .subscribe(response => {
      this.market_cap = response.market_cap;
      this.price_usd = response.price_usd;
        this.chart = new StockChart({
          chart: {
            type: 'area',
            zoomType: 'x',
            backgroundColor: null
          },
          rangeSelector: {
            enabled: false,
          },
          scrollbar: {
            enabled: false
          },
          tooltip: {
            shared: true,
            crosshairs: {
              color: '#2d2073',
              zIndex: 22,
              dashStyle: 'solid'
            },
            style: {
              color: '#2d2073',
            },
            backgroundColor: '#FFF',
            borderColor: '#2d2073',
            borderRadius: 5,
            borderWidth: 1
          },
          xAxis: {
            inside: true,
          },
          yAxis: [
            {
              gridLineWidth: 0,
              title: {
                text: 'Price in USD',
                style: {
                  color: 'rgba(247, 106, 1, 1)',
                }
              },
              labels: {
                format: '${value}',
              },
              opposite: false,
              showEmpty: false
            },
          ],
          plotOptions: {
            area: {
              lineWidth: 1,
              marker: {
                enabled: false
              },
              states: {
                hover: {
                  lineWidth: 1
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
              color: 'rgba(247, 106, 1, 1)',
              name: 'Price in USD',
              data: this.price_usd,
              yAxis: 0,
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, 'rgba(247, 106, 1, 1)'],
                  [1, 'rgba(255,255,255,.25)']
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
          }
        });
    });
  }

  realTimeData() {
    const url = window.location.href;
    const coinid = url.split('/');
    this.coinservice.getSingleCoin(coinid[4])
    .subscribe(resData => {
      console.log(resData);
      if (resData.status === true) {
        this.titleService.setTitle(resData.data.name + ' (' + resData.data.symbol + ') Price - Coinlisting');
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
