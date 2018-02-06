import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { ToasterModule } from 'angular2-toaster';
import { SocialLoginModule, AuthServiceConfig } from 'angular4-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angular4-social-login';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('657460625068-68ekbm870e00v3lio74ueumc718dgir6.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('1592228807481172')
  }
]);


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
import { SupportComponent } from './support/support.component';
import { AdvertiseComponent } from './advertise/advertise.component';
import { FollowlistComponent } from './followlist/followlist.component';
import { ProfileComponent } from './profile/profile.component';

export function highchartsModules() {
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
        path: 'advertise',
        component: AdvertiseComponent,
        pathMatch: 'full'
      },
      {
        path: 'support',
        component: SupportComponent,
        pathMatch: 'full'
      },
      {
        path: 'user/portfolio',
        component: PortfolioComponent,
        pathMatch: 'full'
      },
      {
        path: 'user/followlist',
        component: FollowlistComponent,
        pathMatch: 'full'
      },
      {
        path: 'user/profile',
        component: ProfileComponent,
        pathMatch: 'full'
      },
    ]),
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ChartModule,
    ToasterModule,
    SocialLoginModule.initialize(config)
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
    SupportComponent,
    AdvertiseComponent,
    FollowlistComponent,
    ProfileComponent
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
