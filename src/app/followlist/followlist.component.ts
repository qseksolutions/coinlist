import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';

@Component({
  selector: 'app-followlist',
  templateUrl: './followlist.component.html',
  styleUrls: ['./followlist.component.css'],
  providers: [CoinService],
})
export class FollowlistComponent implements OnInit {

  private toasterService: ToasterService;
  public toasterconfig: ToasterConfig =
  new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: false,
    timeout: 2000
  });

  public urlString: any = myGlobals.base_url;
  public login_ses: any = myGlobals.login_ses;
  followlist: any;
  graph: any;

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService, private http: Http) {
    this.toasterService = toasterService;

    if (this.login_ses == null) {
      window.location.href = this.urlString;
    }
  }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.graph = '00,120,20,120,40,160,60,60,80,80,100,80,120,60,140,100,160,90,180,80,200,110,220,10,240,70,260,100,280,100,300,40,320,0,340,100,360,100,380,120,400,60,420,70,440,80';
    this.coinservice.followlist().subscribe(resData => {
      if (resData.status === true) {
        this.followlist = resData.data;
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

  errorHandler(event, name) {
    const imgurl = 'assets/currency-190/' + name.toLowerCase() + '.png';
    this.isImage(imgurl).then(function (test) {
      // tslint:disable-next-line:triple-equals
      if (test == true) {
        return event.target.src = imgurl;
      } else {
        return event.target.src = 'assets/currency-190/not-found-190.png';
      }
    });
  }

  followcoin(coin) {
    this.coinservice.cointrackbyuser(1, coin.coin_id, coin.name).subscribe(resData => {
      if (resData.status === true) {
        if (coin.followstatus === 1) {
          coin.followstatus = 0;
        } else {
          coin.followstatus = 1;
        }
        this.toasterService.pop('success', 'Success', resData.message);
        setTimeout(() => {
          this.ngOnInit();
        });
      } else {
        this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
      }
    });
  }

}
