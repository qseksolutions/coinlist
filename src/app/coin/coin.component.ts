import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
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
  chart: StockChart;
  interval: any;
  coin: any;
  market_cap: any;
  price_usd: any;
  selectedIndex: any = 6;
  perioddata: any;

  constructor(private coinservice: CoinService, private router: Router, private titleService: Title) {
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
      if (resData.length > 0) {
        this.titleService.setTitle(resData[0]['name'] + ' (' + resData[0]['symbol'] + ') Price - Coinlisting');
        const imgurl = 'assets/currency-svg/' + resData[0]['symbol'].toLowerCase() + '.svg';
          this.isImage(imgurl).then(function (test) {
            // tslint:disable-next-line:triple-equals
            if (test == true) {
              resData[0].imgpath = 'assets/currency-svg/' + resData[0]['symbol'].toLowerCase() + '.svg';
            } else {
              resData[0].imgpath = 'assets/currency-25/' + resData[0]['symbol'].toLowerCase() + '.png';
            }
          });
          setTimeout(() => {
            this.coin = resData[0];
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
