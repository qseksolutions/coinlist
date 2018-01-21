import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { ToasterModule } from 'angular2-toaster';

import highstock from 'highcharts/modules/stock.src';
import exporting from 'highcharts/modules/exporting.src';

import { AppComponent } from './app.component';
import { AmountComponent } from './amount/amount.component';
import { CoinComponent } from './coin/coin.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';


export function highchartsModules() {
    // apply Highstock Modules to this array
    return [ highstock, exporting ];
}

@NgModule({
  imports:      [
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'coin/:any',
        component: CoinComponent,
        pathMatch: 'full'
      },
      {
        path: 'exchange',
        component: ExchangeComponent,
        pathMatch: 'full'
      },
      {
        path: 'amount',
        component: AmountComponent,
        pathMatch: 'full'
      },
      {
        path: 'amount',
        component: AmountComponent,
        pathMatch: 'full'
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
        pathMatch: 'full'
      },
      {
        path: 'watchlist',
        component: WatchlistComponent,
        pathMatch: 'full'
      },
    ]),
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ChartModule,
    ToasterModule,
  ],
  declarations: [
    AppComponent,
    AmountComponent,
    CoinComponent,
    ExchangeComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    PortfolioComponent,
    WatchlistComponent
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
